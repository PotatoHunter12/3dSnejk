document.getElementsByClassName("finalScore")[0].innerHTML = "Final Score: " + getFinalScoreFromLocalStorage();

function getFinalScoreFromLocalStorage() {
    return localStorage.getItem("final_score") || 0;
}