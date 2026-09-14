const buttons = document.querySelectorAll(".slide-btn");
const pages = document.querySelectorAll(".page");

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const pageId = button.dataset.page;

        buttons.forEach((item) => {
            item.classList.remove("active");
        });

        pages.forEach((page) => {
            page.classList.remove("active");
        });

        button.classList.add("active");
        document.getElementById(pageId)?.classList.add("active");
    });
});
