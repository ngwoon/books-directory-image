function onCardClicked(file) {
    const nextURL = "/documents/document" + "?file=" + file;
    location.href = nextURL;
}