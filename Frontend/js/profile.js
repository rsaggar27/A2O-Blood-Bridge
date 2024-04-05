// JavaScript for edit functionality
document.querySelectorAll(".detail").forEach(function(detail) {
    var input = detail.querySelector(".edit-input");
    var span = detail.querySelector("span");

    // Click event for the detail container
    detail.addEventListener("click", function() {
        input.style.display = "inline-block";
        input.value = span.textContent;

        // Hide the span
        span.style.display = "none";
    });

    // Blur event for the input field
    input.addEventListener("blur", function() {
        span.textContent = input.value;
        input.style.display = "none";
        span.style.display = "inline-block";
    });
});
