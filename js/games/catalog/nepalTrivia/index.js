import { nepalTrivia } from "./data.js";

export function start({ container, onExit }) {
    const controller = new AbortController();
    let currentQuestionIndex = 0;
    let score = 0;
    let answeredQuestions = false;

    const questions = [...nepalTrivia];

    // Shuffle this game's copy of the questions.
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    let advanceTimeoutId;

    const card = document.createElement("article");
    card.className = "game-card";

    const title = document.createElement("h2");
    title.textContent = "🇳🇵 Nepal Trivia";

    const prompt = document.createElement("p");
    prompt.id = "trivia-prompt";
    prompt.setAttribute("aria-live", "polite");

    const answerButtonsContainer = document.createElement("div");
    answerButtonsContainer.id = "answer-buttons";

    const exitButton = document.createElement("button");
    exitButton.className = "trivia-exit-button";
    exitButton.type = "button";
    exitButton.textContent = "← Back to games";
    exitButton.addEventListener("click", onExit, {
        signal: controller.signal
    });

    card.append(title, prompt, answerButtonsContainer, exitButton);
    container.replaceChildren(card);

    showNextQuestion();

    return {
        stop() {
            controller.abort();
            clearTimeout(advanceTimeoutId);
        }
    };

    function showNextQuestion() {
        answeredQuestions = false;

        if (currentQuestionIndex >= questions.length) {
            prompt.textContent =
                `You scored ${score} out of ${questions.length}!`;
            answerButtonsContainer.replaceChildren();
            return;
        }

        const question = questions[currentQuestionIndex];
        prompt.textContent = question.prompt;
        answerButtonsContainer.replaceChildren();

        question.answers.forEach((answer, index) => {
            const button = document.createElement("button");
            button.className = "answer-button";
            button.type = "button";
            button.textContent = answer;
            button.addEventListener(
                "click",
                () => checkAnswer(index, question.correctAnswerIndex),
                { signal: controller.signal }
            );
            answerButtonsContainer.appendChild(button);
        });

        currentQuestionIndex++;
    }

    function checkAnswer(selectedIndex, correctIndex) {
        if (answeredQuestions) return;
        answeredQuestions = true;

        if (selectedIndex === correctIndex) {
            score++;
            prompt.textContent = "Correct!";
        } else {
            const correctAnswer =
                questions[currentQuestionIndex - 1].answers[correctIndex];
            prompt.textContent = `Not quite. The answer is ${correctAnswer}.`;
        }

        answerButtonsContainer.querySelectorAll("button").forEach(button => {
            button.disabled = true;
        });

        advanceTimeoutId = setTimeout(showNextQuestion, 1600);
    }
}