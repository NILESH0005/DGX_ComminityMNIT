import { useLocation } from "react-router-dom";
import SubModuleCard from "./SubmoduleCard";
import SubModuleCardNative from "./SubModuleCardNative";

const ModuleRouter = () => {
  const location = useLocation();

  const uiTypeFromState = location.state?.uiType;
  const uiTypeFromStorage = localStorage.getItem("uiType");

  const uiType = uiTypeFromState || uiTypeFromStorage;

  if (uiType === "gamified") return <SubModuleCard />;
  if (uiType === "native") return <SubModuleCardNative />;

  return <SubModuleCardNative />; // fallback
};

export default ModuleRouter;