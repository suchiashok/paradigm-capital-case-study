export default defineEventHandler(async (event) => {
    const { id } = event.context.params;
    return $fetch(`https://paradigmapi.pythonanywhere.com/api/clients/${id}/trades`);
});