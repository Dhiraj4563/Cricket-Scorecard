let team1, team2, tossWinner, decision, strikerName, nonStrikerName, bowlerName;
let maxOvers, maxWickets, currentOver = 0, wickets = 0, totalRuns = 0, runsThisOver = 0, balls = [];
let strikerRuns = 0, nonStrikerRuns = 0;
let inning = 1, firstInningRuns = 0;
let isMatchStarted = false;

function startMatch() {
    team1 = document.getElementById("team1").value;
    team2 = document.getElementById("team2").value;
    tossWinner = document.getElementById("toss").value;
    decision = document.getElementById("decision").value;
    strikerName = document.getElementById("striker").value;
    nonStrikerName = document.getElementById("nonStriker").value;
    bowlerName = document.getElementById("bowler").value;
    maxOvers = parseInt(document.getElementById("maxOvers").value);
    maxWickets = parseInt(document.getElementById("maxWickets").value);

    if (!team1 || !team2 || !tossWinner || !decision || !strikerName || !nonStrikerName || !bowlerName || isNaN(maxOvers) || isNaN(maxWickets)) {
        alert("Please fill in all the fields.");
        return;
    }

    document.querySelector(".setup").style.display = "none";
    document.querySelector(".scorecard").style.display = "block";

    document.getElementById("teamNames").innerText = `Teams: ${team1} vs ${team2}`;
    document.getElementById("tossDecision").innerText = `Toss Winner: ${tossWinner}, Decided to ${decision}`;
    document.getElementById("strikerName").innerText = `*${strikerName} (${strikerRuns})`;
    document.getElementById("nonStrikerName").innerText = `${nonStrikerName} (${nonStrikerRuns})`;
    document.getElementById("bowlerName").innerText = `Bowler: ${bowlerName}`;

    document.getElementById("addBallButton").style.display = "block";
    document.getElementById("deleteLastBallButton").style.display = "block";
    document.getElementById("startSecondInningButton").style.display = "none";
    document.getElementById("resultMessage").style.display = "none";

    isMatchStarted = true;
}

function addBall() {
    if (!isMatchStarted) return;

    const runs = parseInt(document.getElementById("runs").value) || 0;
    if (runs < 0) return;

    balls.push(runs);
    totalRuns += runs;
    runsThisOver += runs;

    if (runs % 2 !== 0) {
        [strikerName, nonStrikerName] = [nonStrikerName, strikerName];
        [strikerRuns, nonStrikerRuns] = [nonStrikerRuns, strikerRuns];
    }

    strikerRuns += runs;
    document.getElementById("strikerName").innerText = `*${strikerName} (${strikerRuns})`;
    document.getElementById("nonStrikerName").innerText = `${nonStrikerName} (${nonStrikerRuns})`;

    updateScoreboard();

    if (balls.length % 6 === 0) {
        endOver();
    }

    if (balls.length >= maxOvers * 6 || wickets >= maxWickets) {
        handleEndOfInnings();
    }

    document.getElementById("runs").value = "";
}

function deleteLastBall() {
    if (!isMatchStarted || balls.length === 0) return;

    const lastRun = balls.pop();
    totalRuns -= lastRun;
    runsThisOver -= lastRun;

    if (balls.length % 6 === 0) {
        currentOver--;
        document.getElementById("newBowlerSection").style.display = "none";
    }

    if (balls.length > 0) {
        const previousRun = balls[balls.length - 1] || 0;
        strikerRuns -= (lastRun || 0);
        document.getElementById("strikerName").innerText = `*${strikerName} (${strikerRuns})`;
        nonStrikerRuns -= (lastRun || 0);
        document.getElementById("nonStrikerName").innerText = `${nonStrikerName} (${nonStrikerRuns})`;
    }

    updateScoreboard();
}

function addWideNoBall() {
    const runs = parseInt(prompt("Enter runs for Wide/No Ball:")) || 0;
    if (runs < 0) return;

    totalRuns += (runs + 1);
    runsThisOver += (runs + 1);

    updateScoreboard();
}

function handleWicket() {
    if (!isMatchStarted) return;

    document.getElementById("newBatsmanSection").style.display = "block";
}

function addNewBatsman() {
    const newBatsman = document.getElementById("newBatsman").value;
    const onStrike = document.getElementById("onStrike").value;

    if (!newBatsman) return;

    if (onStrike === "striker") {
        strikerName = newBatsman;
        strikerRuns = 0;
    } else {
        nonStrikerName = newBatsman;
        nonStrikerRuns = 0;
    }

    document.getElementById("strikerName").innerText = `*${strikerName} (${strikerRuns})`;
    document.getElementById("nonStrikerName").innerText = `${nonStrikerName} (${nonStrikerRuns})`;
    document.getElementById("newBatsmanSection").style.display = "none";
}

function changeBowler() {
    const newBowler = document.getElementById("newBowler").value;
    if (!newBowler) return;

    bowlerName = newBowler;
    document.getElementById("bowlerName").innerText = `Bowler: ${bowlerName}`;
    document.getElementById("newBowlerSection").style.display = "none";
}

function addNewBowler() {
    const newBowler = document.getElementById("newBowler").value;
    if (!newBowler) return;

    bowlerName = newBowler;
    document.getElementById("bowlerName").innerText = `Bowler: ${bowlerName}`;
    document.getElementById("newBowlerSection").style.display = "none";
}

function endOver() {
    currentOver++;
    runsThisOver = 0;
    document.getElementById("newBowlerSection").style.display = "block";
}

function updateScoreboard() {
    document.getElementById("totalRuns").innerText = `Total Runs: ${totalRuns}`;
    document.getElementById("runsThisOver").innerText = `Runs This Over: ${runsThisOver}`;
    document.getElementById("balls").innerText = `Balls: ${balls.length}`;
    document.getElementById("overs").innerText = `Overs: ${Math.floor(balls.length / 6)}.${balls.length % 6}`;
    document.getElementById("wickets").innerText = `Wickets: ${wickets}`;
}

function handleEndOfInnings() {
    if (inning === 1) {
        firstInningRuns = totalRuns;
        inning++;
        resetScorecard();
        document.getElementById("startSecondInningButton").style.display = "block";
    } else {
        document.getElementById("startSecondInningButton").style.display = "none";

        if (totalRuns >= (firstInningRuns + 1)) {
            document.getElementById("resultMessage").innerText = `Second team wins by ${totalRuns - firstInningRuns} runs!`;
        } else {
            document.getElementById("resultMessage").innerText = `First team wins by ${firstInningRuns - totalRuns} runs!`;
        }
        document.getElementById("resultMessage").style.display = "block";
    }
}

function startSecondInning() {
    if (!isMatchStarted) return;

    document.querySelector(".setup").style.display = "block";
    document.querySelector(".scorecard").style.display = "none";

    // Reset for the second innings
    currentOver = 0;
    wickets = 0;
    totalRuns = 0;
    runsThisOver = 0;
    balls = [];
    strikerRuns = 0;
    nonStrikerRuns = 0;

    document.getElementById("strikerName").innerText = `*${strikerName} (${strikerRuns})`;
    document.getElementById("nonStrikerName").innerText = `${nonStrikerName} (${nonStrikerRuns})`;
    document.getElementById("totalRuns").innerText = `Total Runs: ${totalRuns}`;
    document.getElementById("runsThisOver").innerText = `Runs This Over: ${runsThisOver}`;
    document.getElementById("balls").innerText = `Balls: ${balls.length}`;
    document.getElementById("overs").innerText = `Overs: ${Math.floor(balls.length / 6)}.${balls.length % 6}`;
    document.getElementById("wickets").innerText = `Wickets: ${wickets}`;

    // Prompt for new batter and bowler names
    strikerName = prompt("Enter new striker name:");
    nonStrikerName = prompt("Enter new non-striker name:");
    bowlerName = prompt("Enter new bowler name:");

    if (strikerName && nonStrikerName && bowlerName) {
        document.getElementById("strikerName").innerText = `*${strikerName} (${strikerRuns})`;
        document.getElementById("nonStrikerName").innerText = `${nonStrikerName} (${nonStrikerRuns})`;
        document.getElementById("bowlerName").innerText = `Bowler: ${bowlerName}`;
    } else {
        alert("Please provide all names.");
    }
}

function resetScorecard() {
    currentOver = 0;
    wickets = 0;
    totalRuns = 0;
    runsThisOver = 0;
    balls = [];
    strikerRuns = 0;
    nonStrikerRuns = 0;

    document.getElementById("strikerName").innerText = `*${strikerName} (${strikerRuns})`;
    document.getElementById("nonStrikerName").innerText = `${nonStrikerName} (${nonStrikerRuns})`;
    document.getElementById("totalRuns").innerText = `Total Runs: ${totalRuns}`;
    document.getElementById("runsThisOver").innerText = `Runs This Over: ${runsThisOver}`;
    document.getElementById("balls").innerText = `Balls: ${balls.length}`;
    document.getElementById("overs").innerText = `Overs: ${Math.floor(balls.length / 6)}.${balls.length % 6}`;
    document.getElementById("wickets").innerText = `Wickets: ${wickets}`;
}
