import {useState} from 'react'

import './Game.css'
import './buttons.css'
import './Score.css'

// import db2010 from '../data/2010dataimage.json'
import db2020 from '../data/2020dataimage.json'
import Arrow from '../assets/arrow.svg'

export default function Game(props:any) {

    const getRandomSong = (_not:number, __not:number):number => {
        let randomNumber = Math.floor(Math.random() * db2020.length)
        if (randomNumber === _not || randomNumber === __not)
            return getRandomSong(_not, __not)
        else
            return randomNumber
    }

    const checkWin = (High:boolean, valOne:number, valTwo:number):boolean => {
        if (High){
            return (valOne <= valTwo)
        } 
        else if (!High) {
            return (valOne >= valTwo)
        }
        return false
    }
    const UpdateGameOrGameOver = (High:boolean, valOne:number, valTwo:number):void => {

        if (checkWin(High, valOne, valTwo) === true){
            props.updateGameScore(props.score + 1)

            setButtonAnimate(true)
            setTimeout(() => {
                setAnimateGreen(true)

            }, 1000)


            setTimeout(() => {
                setScoreAnimate(true)
            }, 2000)


            setTimeout(() => {
                setButtonAnimate(false)
                setScoreAnimate(false)
                setAnimateGreen(false)
                
                let firstIndex = firstArrIndex
                let secondIndex = secondArrIndex

                setFirstArrIndex(secondIndex)
                setSongOne(songTwo)
                
                const randomNum = getRandomSong(firstIndex, secondIndex)

                setSecondArrIndex(randomNum)
                setSongTwo(db2020[randomNum])

            }, 4000)

        }
        else {
            setButtonAnimate(true)

            setTimeout(() => {
                setAnimateRed(true)
            }, 1000)

            setTimeout(() => {
                setButtonAnimate(false)
                setAnimateRed(false)
                

                const prevHighScore = window.localStorage.getItem("High Score")
                if (prevHighScore === null || props.score > parseInt(prevHighScore)){
                    window.localStorage.setItem("High Score", props.score.toString())
                }
                // props.updateGameScore(0)
                props.endGame(true)
            }, 4000)

            

        }
    }

    const [scoreAnimate, setScoreAnimate] = useState(false)
    const [buttonAnimate, setButtonAnimate] = useState(false)
    const [animateGreen, setAnimateGreen] = useState(false)
    const [animateRed, setAnimateRed] = useState(false)

    const [firstArrIndex, setFirstArrIndex] = useState(getRandomSong(-1, -1))
    const [songOne, setSongOne] = useState(db2020[firstArrIndex])

    const [secondArrIndex, setSecondArrIndex] = useState(getRandomSong(firstArrIndex, -1))
    const [songTwo, setSongTwo] = useState(db2020[secondArrIndex])

    const [highScore , setHighScore] = useState(window.localStorage.getItem("High Score") || 0)

    type musicalAttributeType = "danceability" | "energy" | "loudness" | "tempo" |"valence"
    const musicalAttribute:musicalAttributeType = props.gameMode


    return (
        <div className="gameContainer">
                <div className={`centerIcon ${animateGreen ? "versus-green" : animateRed ? "versus-red" : ""}`}>
                    <div>VS</div>
                </div>

            <div id="leftPanel" className="gamePanel" style={{backgroundImage:`url(${songOne.image_url})`}}>
                <iframe src={`https://open.spotify.com/embed/track/${songOne.id}?utm_source=generator`}  height="80" frameBorder="0"  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
                <div className="panelText">
                    <p className="songName">{songOne.SONGNAME}</p>
                    has 
                    <p className="measurement" >{songOne[musicalAttribute as keyof typeof songOne]}</p>
                    <span style={{fontWeight:'500', fontSize:'18px'}}>{musicalAttribute}</span>
                </div>
            </div>
            
            
            
            <div id="rightPanel" className="gamePanel" style={{backgroundImage:`url(${songTwo.image_url})`}}>
                <iframe src={`https://open.spotify.com/embed/track/${songTwo.id}?utm_source=generator`}  height="80" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
                <div className="panelText">
                    <p className="songName">{songTwo.SONGNAME}</p>
                    has
                    {buttonAnimate ? (
                    <p className={`measurement ${buttonAnimate ? "animate-measurement" : ""}`} >
                        {songTwo[musicalAttribute as keyof typeof songTwo]}
                    </p>)  
                    :
                    (<div className="buttonContainer">
                        <button
                        className="answerBtn"
                        onClick={() => UpdateGameOrGameOver(true, songOne[musicalAttribute], 
                            songTwo[musicalAttribute])}
                        >
                            Higher <img src={Arrow} id="up-arrow" alt="up-arrow"/>
                        </button>
                        <button
                            className="answerBtn"
                            onClick={() => UpdateGameOrGameOver(false, songOne[musicalAttribute], 
                                songTwo[musicalAttribute])}
                        >
                            Lower <img src={Arrow} id="down-arrow" alt="down-arrow"/>
                        </button>
                    </div> )}

                    
                    <span style={{fontWeight:'500', fontSize:'18px'}}>{musicalAttribute} than {songOne.SONGNAME}</span>
                    
                </div>
            </div>
            
            <div className="scoreContainer">
                        <h2 className="scoreKeeper">
                            High Score: {highScore}
                        </h2>
                        <h2 className={`scoreKeeper ${scoreAnimate ? "animate-score" : ""}`} >
                            Current Score: {props.score}
                        </h2>
                    </div>
            
            
        
        
        
        </div>
    )
}