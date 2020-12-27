function onSubmitBtnClicked(event) {
    event.preventDefault();

    const content = document.querySelector(".js-searchTerm").value;
    if(content === "")
        return false;
    
    this.action = "/documents";
    this.method = "GET";
    this.submit();
}


function init() {
    const form = document.querySelector(".js-search-form");
    form.addEventListener('submit', onSubmitBtnClicked);
}

init();