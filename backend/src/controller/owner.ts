import { Response } from "express";
import { Property } from "../entities/Property";
import { PropertyPhoto } from "../entities/PropertyPhoto";
import { Description } from "../entities/Description";
import { PropertyPolicies } from "../entities/PropertyPolicies";
import cloudinary from "../config/cloudinary";
import { getConnection } from "../database/db.config";
import { AuthenticatedRequest } from "../types/requestTypes";
// import { User } from "../entities/Users";
import { Owner } from "../entities/Owner";

/**
 * @function handleProperty
 * @description Handles the creation of a property by an owner.
 */
export async function handleProperty(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const AppDataSource = await getConnection();

    const {
      address,
      propertyType,
      squareFootage,
      bedrooms,
      bathrooms,
      rent,
      noOfSet,
      securityDeposit,
      leaseTerm,
      availableDate,
      isAvailable,
      propertyTitle,
      detailedDescription,
      shortDescription,
      amenities,
      neighborhood,
      transportation,
      neighborhoodDescription,
      pointsOfInterest,
      neighborhoodLatitude,
      neighborhoodLongitude,
      petPolicy,
      smokingPolicy,
      smokingPolicyDescription,
      petPolicyDescription,
      noisePolicy,
      guestPolicy,
      additionalPolicies,
      location,
    } = req.body;

    const userId = req.user?.id;

    const userRepository = AppDataSource.getRepository(Owner);
    const propertyRepo = AppDataSource.getRepository(Property);
    const descriptionRepo = AppDataSource.getRepository(Description);
    const policyRepo = AppDataSource.getRepository(PropertyPolicies);
    const photoRepo = AppDataSource.getRepository(PropertyPhoto);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Helper function for safely parsing JSON
    const safeJsonParse = (value: any) => {
      try {
        return typeof value === "string" ? JSON.parse(value) : value;
      } catch {
        return value;
      }
    };

    const parsedAmenities = safeJsonParse(amenities);
    const parsedPOI = safeJsonParse(pointsOfInterest);
    const parsedPolicies = safeJsonParse(additionalPolicies);

    const files = (req.files as Express.Multer.File[]) || [];
    const uploadedPhotos: PropertyPhoto[] = [];

    const uploadToCloudinary = (
      file: Express.Multer.File
    ): Promise<PropertyPhoto> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "main_rental",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) return reject(error);

            const photo = photoRepo.create({ url: result.secure_url });
            resolve(photo);
          }
        );
        stream.end(file.buffer);
      });
    };

    for (const file of files) {
      const photo = await uploadToCloudinary(file);
      uploadedPhotos.push(photo);
    }

    const description = descriptionRepo.create({
      title: propertyTitle,
      description: detailedDescription,
      shortDescription,
      amenities: parsedAmenities,
      neighborhood,
      transportation,
      neighborhoodDescription,
      pointsOfInterest: parsedPOI,
      neighborhoodLatitude: parseFloat(neighborhoodLatitude),
      neighborhoodLongitude: parseFloat(neighborhoodLongitude),
    });

    const policies = policyRepo.create({
      petPolicy,
      smokingPolicy,
      noisePolicy,
      guestPolicy,
      additionalPolicies: parsedPolicies,
      smokingPolicyDescription,
      petPolicyDescription,
    });

    const newProperty = propertyRepo.create({
      address,
      propertyType,
      squareFootage: Number(squareFootage),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      rent: Number(rent),
      noOfSet: Number(noOfSet),
      totalRoom: Number(noOfSet),
      securityDeposit: Number(securityDeposit),
      leaseTerm,
      availableDate: availableDate ? new Date(availableDate) : null,
      isAvailable: isAvailable === "true" || isAvailable === true,
      photos: uploadedPhotos,
      description,
      policies,
      owner: user,
    });

    await propertyRepo.save(newProperty);

    // Return full property with relations
    const savedProperty = await propertyRepo.findOne({
      where: { id: newProperty.id },
      relations: ["owner", "photos", "description", "policies"],
    });

    res.status(201).json({
      message: "Property created successfully",
      property: savedProperty,
    });
  } catch (error) {
    console.error("Error in handleProperty:", error);
    res.status(500).json({ message: "Failed to create property", error });
  }
}

/**
 * @function handleGetCurrentOwnerProperty
 * @description Fetches properties for the current owner.
 */
export async function handleGetCurrentOwnerProperty(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const AppDataSource = await getConnection();
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userRepository = AppDataSource.getRepository(Owner);
    const propertyRepository = AppDataSource.getRepository(Property);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userProperties = await propertyRepository.find({
      where: { owner: { id: userId } },
      relations: ["description", "photos", "policies"],
      order: {
        created_at: "DESC",
      },
    });

    res.status(200).json({
      message: "Properties fetched successfully",
      properties: userProperties,
    });
  } catch (error) {
    console.error("Error in handleGetCurrentOwnerProperty:", error);
    res.status(500).json({ message: "Failed to fetch properties", error });
  }
}
