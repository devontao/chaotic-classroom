import { useState, useRef } from 'react';
import {GameMode, AIPolicy, GameState, Energy} from './enums.js'
import { GameEvent } from './GameEvent.js'
import studentImage from './assets/student.jpeg'

export default function Game(){
    const [gameMode, setGameMode] = useState(null);
    const [gameState, setGameState] = useState(GameState.START_MENU);
    const [policy, setPolicy] = useState(null);
    const [energy, setEnergy] = useState(Energy.START);
    const [gameEvent, setGameEvent] = useState(GameEvent.NONE)
    const [papersGraded, setPapersGraded] = useState(0)
    const [studentsCaught, setStudentsCaught] = useState(0)
    const [studentsGotAway, setStudentsGotAway] = useState(0)
    const [studentsFalselyAccused, setStudentsFalselyAccused] = useState(0)
    const studentUseAI = useRef(false);
    const profSuspectAI = useRef(false);

    function ProfessorButton() {
        function handleClick() {
            setGameMode(GameMode.PROFESSOR);
            setGameState(GameState.PROFESSOR_MENU)
        }
        return (
            <>
            <div className="game-mode-select">
                <h2>Professor</h2>
                <img src="https://designlab.ucsd.edu/_images/people/samlau_headshot.jpg" onClick={handleClick} height="200px"/>
            </div>
            </>
        )
    }

    function StudentButton() {
        function handleClick() {
            setGameMode(GameMode.STUDENT);
        }

        return (
            <>
            <div className="game-mode-select">
                <h2>Student</h2>
                <img src={studentImage} onClick={handleClick} height="200px"></img>
            </div>
            </>
        )
    }

    function StartMenu() {
        return(
            <div>
                <h1>I'm playing as a:</h1>
                <div className="menu">
                    <ProfessorButton/>
                    <StudentButton/>
                </div>
            </div>
        )
    }

    function ProfessorMenu() {
        function handleClick(e) {
            setPolicy(e.target.value);
            setGameState(GameState.PROFESSOR_GAME)
        }
        return(
            <div>
                <h1>What is your AI policy?</h1>
                <div className="menu">
                    <button value={AIPolicy.NONE} onClick={handleClick}>BAN IT</button>
                    <button value={AIPolicy.CITATION} onClick={handleClick}>Okay with citation</button>
                    <button value={AIPolicy.ALL} onClick={handleClick}>FULL ON AI, BABY!!!</button>
                </div>
            </div>
        )
    }

    function ProfessorGame() {
        // TODO: magic number
        let studentAIProb = 0.5
        function rollEvent() {
            studentUseAI.current = Math.random() < studentAIProb;
            // Does the professor suspect AI?
            profSuspectAI.current = studentUseAI.current ? (Math.random() < GameEvent.SUSPECT_AI.truePosRate) : (Math.random() < GameEvent.SUSPECT_AI.falsePosRate);
            if (profSuspectAI.current) {
                setGameEvent(GameEvent.SUSPECT_AI);
            }

            if (studentUseAI.current && !profSuspectAI.current) {
                setStudentsGotAway(studentsGotAway + 1);
            }
        }

        function energyCheck() {
            if (energy - Energy.GRADE < 0) {
                setGameState(GameState.GAME_OVER);
            }
        }

        function grade() {
            energyCheck();
            setEnergy(energy - Energy.GRADE);
            rollEvent();
            setPapersGraded(papersGraded + 1)
        }  

        function GameEventBox({eventText}) {
            function DoNothingButton() {
                function handleClick() {
                    if (studentUseAI.current) {
                        setStudentsGotAway(studentsGotAway + 1);
                    }
                    setGameEvent(GameEvent.NONE);
                }
                return( 
                    <button onClick={handleClick}>Do nothing (costs 0 energy)</button>
                )
            }

            function ReportStudentButton() {
                function handleClick() {
                    if (studentUseAI.current) {
                        setStudentsCaught(studentsCaught + 1);
                    } else {
                        setStudentsFalselyAccused(studentsFalselyAccused + 1);
                    }
                    setEnergy(energy-1);
                    energyCheck();
                    setGameEvent(GameEvent.NONE);
                }
                return (
                    <button onClick={handleClick}>Report student (costs 1 energy) </button>
                )
            }
            let buttonDisplay;
            if (gameEvent == GameEvent.NONE) {
                buttonDisplay = <button onClick={grade}>Grade (costs {Energy.GRADE} energy)</button>;
            } else {
                buttonDisplay = <div className="menu"><DoNothingButton/><ReportStudentButton/></div>
            }
            return (
                <div className="event-box">
                    <h3>{eventText}</h3>
                    {buttonDisplay}
                </div>
            )
        }

        return (
            <div>
                <h1>You are a {gameMode}</h1>
                <h1>Your AI policy is: {policy}</h1>
                <h1>You have {energy} energy</h1>
                {/* <GameEventBox
                    eventText={gameEvent.text}
                    eventOptions={gameEvent.options}
                /> */}
                <GameEventBox
                    eventText={gameEvent.text}
                />
            </div>
        )
    }

    // function GameEventBox({eventText, eventOptions}) {
    //     function OptionButton({optionText, optionEnergy}) {
    //         function handleClick() {
    //             setEnergy(energy - optionEnergy);
    //         }
    //         return (
    //             <button onClick={handleClick}>{optionText} (costs {optionEnergy} energy)</button>
    //         )
    //     }
    //     const optionButtons = eventOptions.map(option => 
    //         <OptionButton 
    //             optionText={option.text}
    //             optionEnergy={option.energy}
    //             key={option.id}
    //         />
    //     )
    //     return (
    //         <div className="event-box">
    //             {eventText}
    //             <div className="menu">
    //                 {optionButtons}
    //             </div>
    //         </div>
    //     )
    // }

    function GameOver() {
        return(
            <div>
                <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcontent.imageresizer.com%2Fimages%2Fmemes%2FDark-Souls-You-Died-meme-6.jpg&f=1&nofb=1&ipt=d3e31f4c851345a6a1f0d715a721eb61974aab7c01223ea26f4678b23786097e" height="400px"/>
                <h2>Papers graded: {papersGraded}</h2>
                <h2>Student caught using AI: {studentsCaught}</h2>
                <h2>Students who got away with using AI: {studentsGotAway}</h2>
                <h2>Students falsely accused of using AI: {studentsFalselyAccused}</h2>
            </div>
        )
    }

    let content;
    switch(gameState) {
        case GameState.START_MENU:
            content = <StartMenu/>
            break;
        case GameState.PROFESSOR_MENU:
            content = <ProfessorMenu/>
            break;
        case GameState.PROFESSOR_GAME:
            content = <ProfessorGame/>
            break;
        case GameState.GAME_OVER:
            content= <GameOver/>
            break;
    }

    return(
        <>
        {content}
        </>
    )
}