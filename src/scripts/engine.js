const state = {
    score: {
        playerScore:0,
        computerScore:0,
        scoreBox: document.querySelector('#score-points'),
    } ,
    cardSprites: {
        avatar:document.querySelector('#card-image'),
        name:document.querySelector('#card-name'),
        type:document.querySelector('#card-type'),        
    } ,
    fieldCards: {
        playerCard: document.querySelector('#player-field-card'),
        computerCard: document.querySelector('#computer-field-card'),
    } ,
    actions: {
        button: document.querySelector('#next-duel') , 
        bgm: new Audio('./src/assets/audios/egyptian_duel.mp3')       
    } ,
}

const pathImg = "./src/assets/icons/"
const cardData = [
    {
        id: 0,
        nome: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImg}dragon.png`,
        winOf: [1],
        loseOf: [2],
    } ,
    {
        id: 1,
        nome: "Dark Magician",
        type: "Rock",
        img: `${pathImg}magician.png`,
        winOf: [2],
        loseOf: [0],
    } ,
    {
        id: 2,
        nome: "Exodia",
        type: "Scissor",
        img: `${pathImg}exodia.png`,
        winOf: [0],
        loseOf: [1],
    } ,
]

const playerSide = {
    player1: "player-cards",
    computer: "computer-cards",
}

async function getRandomCardID() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

async function removeAllCardsInField() {
    let cards = document.querySelectorAll('.card-box.framed')

    cards.forEach((element) => {
        let imgElement = element.querySelectorAll('img')
        imgElement.forEach((img) => img.remove())
    })     
}

async function drawSelectedCard(index) {
    state.cardSprites.avatar.src = cardData[index].img
    state.cardSprites.name.innerHTML = cardData[index].nome
    state.cardSprites.type.innerHTML = `Attribute: ${cardData[index].type}`
}

async function setCardsField(dataId) {
    await removeAllCardsInField()

    let computerCardId = await getRandomCardID()

    state.fieldCards.playerCard.style.display = "block" 
    state.fieldCards.computerCard.style.display = "block" 
    state.cardSprites.avatar.removeAttribute("src")    
    state.fieldCards.playerCard.src = cardData[dataId].img
    state.fieldCards.computerCard.src = cardData[computerCardId].img

    let duelResults = await checkDuelResults(dataId,computerCardId)

    await upDateScore()
    await drawButton(duelResults)
}

async function upDateScore() {
    state.score.scoreBox.innerHTML = `Win x ${state.score.playerScore} | Lose x ${state.score.computerScore}`
}

async function drawButton(result) {
    state.actions.button.innerHTML = result
}

async function checkDuelResults(playerCardId,computerCardId) {
    let duelResult = "DRAW"
    let playerCard = cardData[playerCardId]    

    if(playerCard.winOf.includes(computerCardId)) {
        duelResult = "YOU WIN!"
        await playSound("win")
        state.score.playerScore++        
    } 
    if(playerCard.loseOf.includes(computerCardId)) {
        duelResult = "YOU LOSE!"
        await playSound("lose")
        state.score.computerScore++        
    }

    return duelResult
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img")
    cardImage.setAttribute("height", "130px")
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png")
    cardImage.setAttribute("data-id", IdCard)
    cardImage.classList.add("card")

    if(fieldSide === playerSide.player1) {
        cardImage.addEventListener("click", () => [
            setCardsField(cardImage.getAttribute("data-id"))
        ])
        cardImage.addEventListener("mouseover",() => {
            drawSelectedCard(IdCard)
        })
    }

    return cardImage
}

async function drawCards(cardsNumber, fieldSide) {
    for(let i=0;i < cardsNumber;i++) {
        const randomCard = await getRandomCardID()
        const cardImage = await createCardImage(randomCard, fieldSide)

        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function resetDuel() {
    if(state.fieldCards.playerCard.getAttribute("src")){        
        state.cardSprites.name.innerHTML = "Card"
        state.cardSprites.type.innerHTML = "Information"
        state.fieldCards.playerCard.removeAttribute("src")        
        state.fieldCards.playerCard.style.display = "none"             
        state.fieldCards.computerCard.style.display = "none"             
        state.actions.button.innerHTML = "Vs"  

        start()
    }
}

async function playSound(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play()
}

function start() {
    drawCards(5, playerSide.player1)
    drawCards(5, playerSide.computer)
    state.actions.bgm.play()
    state.actions.bgm.loop
}

start()