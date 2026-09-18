export const hasPageAccess = (allowedPages, pageId) => {
  return allowedPages.some(
    (page) => Number(page.PageID) === Number(pageId)
  );
};