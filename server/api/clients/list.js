export default defineEventHandler(async (event) => {
      return $fetch(`https://paradigmapi.pythonanywhere.com/api/clients`);
});