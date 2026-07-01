const form = document.getElementById("leadForm");
const submitBtn = document.getElementById("submitBtn");
const errorBanner = document.getElementById("errorBanner");
const errorMsg = document.getElementById("errorMsg");
const successState = document.getElementById("successState");

function setLoading(on) {
    submitBtn.disabled = on;
    submitBtn.classList.toggle("loading", on);
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorBanner.classList.add("visible");
    errorBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideError() {
    errorBanner.classList.remove("visible");
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const joiningDate = document.getElementById("joiningDate").value;

    if (!fullName || !email || !phone || !joiningDate) {
        showError("Please fill in all fields before submitting.");
        return;
    }

    setLoading(true);

    try {
        const res = await fetch("https://api.formendpoint.tech/f/fm_d8cad9191bea4366", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, email, phone, joiningDate }),
        });

        if (!res.ok) {
            let detail = "";
            try {
                const body = await res.json();
                detail = body.message || body.error || "";
            } catch (_) {}
            throw new Error(
                detail || `Server returned ${res.status}. Please try again.`,
            );
        }

        // success — swap form for confirmation
        form.style.display = "none";
        successState.classList.add("visible");
    } catch (err) {
        if (err instanceof TypeError) {
            // network / CORS / unreachable
            showError(
                "Unable to reach the server. Check your connection and try again.",
            );
        } else {
            showError(err.message || "Something went wrong. Please try again.");
        }
    } finally {
        setLoading(false);
    }
});
