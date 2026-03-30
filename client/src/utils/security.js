export const enableBasicSecurity = () => {
  // Disable DevTools shortcuts
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
      (e.ctrlKey && e.key.toLowerCase() === "u")
    ) {
      e.preventDefault();
    }
  });

  // Disable Right Click
  document.addEventListener("contextmenu", (e) => e.preventDefault());
};