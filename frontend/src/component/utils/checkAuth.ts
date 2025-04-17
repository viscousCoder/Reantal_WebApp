import { redirect } from "react-router-dom";

export function checkAuthLoader() {
  if (!localStorage.getItem("token")) {
    return redirect("/login");
  }
  return null;
}
