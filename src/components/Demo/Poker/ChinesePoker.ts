import { pickBy } from "lodash"

const CardMaps: any = {
    '2': 2 * 10,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14,
    'joker': 999,
    'JOKER': 1000
}

const CardSpecies: PokerSpecies[] = ['♠️' , '♥️' , '♣️' , '♦️']

const CardTypes = Object.keys(CardMaps)
const CardValues = Object.values(CardMaps)

type PokerSpecies = '♠️' | '♥️' | '♣️' | '♦️' | 'joker' | 'JOKER'

export type CardProps = {
    type?: PokerSpecies,
    value: number
}

const playerNum = 3  // 3人斗地主
const timerNum = 6  // 问询时间 15 秒

// 等待函数
function sleep(ms: number){
    return new Promise((resolve) => setTimeout(resolve, ms))
}

// 数组求和函数
function sum(arr: any[]) {
    return arr.reduce((pre, next) => parseInt(pre) + parseInt(next),0)
}

function wait(ask?: any, autoReply?: any) {
    let num = 0
    let timer: any = null
    // console.log('-----autoReply---->', autoReply)
    return new Promise((resolve: any) => {
        timer = setInterval(() => {
            num++
            // console.log(timerNum - num)
            // 人机交互
            const answer = ask?.()
            if (answer) {
                resolve(answer)
                clearInterval(timer)
            } else if (timerNum - num <= 0){
                resolve(autoReply)
                clearInterval(timer)
            }
        }, 1000)
    })
}

// 洗牌算法
function randomizeArray(arr: any[]) {
    const newArr = arr.slice(); // 创建原始数组的副本
    for (let i = newArr.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[randomIndex]] = [newArr[randomIndex], newArr[i]];
    }
    return newArr;
}

// 发牌算法 【扑克牌, 玩家，底牌】
function dealPoker(cards: any[], playerNum: number, reservedNum: number) {
    const playerArr: any[] = new Array(playerNum)
    for(let i = 0; i < playerNum; i++) {
        playerArr[i] = []
    }
    while(cards.length > reservedNum) {
        for(let i = 0; i < playerNum; i++) {
            playerArr[i].push(cards.pop())
        }
    }

    return {
        playerArr,
        holeCards: cards
    }
}

// 创建扑克牌
function createPoker() {
    const cards: any[] = []
    Object.keys(CardMaps).map((c: any) => {
        if (['joker', 'JOKER'].includes(c)) {
            cards.push(new Card({type: c, value: CardMaps[c]}))
        } else {
            CardSpecies.map((s: any) => {
                cards.push(new Card({type: s, value: CardMaps[c]}))
            })
        }
    })
    return cards
}

// 统计扑克牌
function statisticsPoker(cards: any[]) {
    return cards.reduce((pre: any, next: any) => {
        pre[next['value']] = pre[next['value']] ? pre[next['value']]+1 : 1
        return pre
    }, {})
}

// 分析扑克
// function analyzePoker(cards: any[]) {

// }

function systomInfo(player: any, out?: any) {
    const { name, master, cards } = player
    if (player) {
        const copyCards = JSON.parse(JSON.stringify(cards)).map((c: any) => `${c.type}${c.value}`)
        console.log(`${name}(${master ? '地主' : '闲农'})手中的牌: ${copyCards} \n`)
    }
    if (out) {
        const outStr = JSON.parse(JSON.stringify(out)).map((c: any) => `${c.type}${c.value}`)
        console.log(`${name}(${master ? '地主' : '闲农'})出牌: ${outStr}`)
    }
}

// 根据当前的 牌 和 手中的牌 自动计算出牌规则
function autoReply(chinesePoker: any, me: any) {
    const { currentBig } = chinesePoker
    const { currentOut } = currentBig
    const currentBigIsMe = currentBig === me  // 当前话语权是不是自己
    const rule = new Rules()
    // console.log('----上家出牌', rule.AITips(preCards, currentCards), statisticsPoker(currentCards))
    if (currentBigIsMe) { // 如果 自己拥有话语权，随便出
        return me.cards.splice(0, 1)
    } 
    return rule.AITips(currentOut, me.cards)
}

class Card {
    type: string | undefined
    value: number
    constructor({type, value}: CardProps){
        this.type = type
        this.value = value
    }
}

class Poker {
    allCards: any[] = []
    constructor(n = 1){ // 几幅扑克，默认为1
       this.create(n)
    }
    create(n = 1) {
        this.allCards = new Array(n).fill(createPoker()).flat()
    }
    wash() {
        this.allCards = randomizeArray(this.allCards)
        return this.allCards
    }
}

export class Player {
    master: boolean
    timer: null
    cards: any
    index: any
    next: null
    pre: null
    name: void
    currentOut: any[]
    chinesePoker: any
    ask: () => null
    returnMe: boolean
    
    constructor({cards, index, name}: any, chinesePoker?: any){
        this.name = name     // 玩家昵称
        this.cards = cards   // 手中的牌
        this.currentOut = [] // 当前出牌
        this.master = false  // 是否是庄家
        this.timer = null    // 计时器
        this.index = index   // 位置座号
        this.next = null     // 下家
        this.pre = null      // 上家
        this.returnMe = false // 是否轮到我出牌
        this.chinesePoker = chinesePoker  // 玩的游戏实例
        this.ask = () => null  // 问询该玩家将要出的牌
        this.sort()
    }
    wantMaster(master = true){  // 是否叫地主
        this.master = master
    }
    sort(){ // 理牌
        this.cards = this.cards.sort((a: any, b: any) => a.value - b.value)
    }
    delCards(cards?: any) { // 删除手中的牌
        cards?.forEach((card: any) => {
            const idx = this.cards.indexOf(card)
            this.cards.splice(idx, 1)
        })
    }
    setReturnMe(returnMe?: boolean) {
        if (returnMe !== undefined) return this.returnMe = !!returnMe
        this.returnMe = this.chinesePoker.current === this
    }
    async out(ask?: any) { //  根据当前局势 分析 出牌
        if (ask) this.ask = ask
        const { currentBig } = this.chinesePoker
        const { currentOut } = currentBig
        if (currentBig === this) { // 如果当前自己 最大，那么自己继续出牌

        }
        const outCards: any = await wait(this.ask, autoReply(this.chinesePoker, this))
        this.ask = () => null // 出完牌后，要把 ask 重置 && 将手中的牌剔除 出的牌
        this.delCards(outCards)
        this.currentOut = outCards
        // console.log('----->', this.cards, outCards)
        return {
            outCards,
            next: this.next
        }
    }
}

// 斗地主规则
type RuleName = '单张' | '对子' | '顺对' | '三不带' | '三带一' | '三带对' | '顺子' | '飞机' | '炸弹' | '王炸' 
class Rules {
    singleCheck(cards: any[]) { // 单牌检测
        const result = cards.length === 1
        const min = cards[0].value
        function handler(handCards: any[]) { // 根据手中牌应对 单张
            const idx = handCards.findIndex(card => card.value > min)
            return idx > -1 ? handCards.splice(idx, 1) : []
        }
        return {
            result,
            type: result ? '单张' : null,
            min,
            max: min,
            handler
        }
    }
    kingBomb(cards: any[]) { // 王炸检测
        const types = cards.map(v => v.type)
        const result = types.length === 2 && types.includes('joker') && types.includes('JOKER')
        function handler(handCards: any[]) {
            return []
        }
        return {
            result,
            type: result ? '王炸' : null,
            min: CardMaps['joker'],
            max: CardMaps['JOKER'],
            handler
        }
    }
    bombCheck(cards: any[]) { // 炸弹检测
        if (![2, 4].includes(cards.length)) {
            return {
                result: false,
                type: null
            }
        }
        const statisRes = statisticsPoker(cards)
        const keys = Object.keys(statisRes)
        const values = Object.values(statisRes);
        const min = keys[0]
        const result = (keys.length === 1 && values.includes(4)) || this.kingBomb(cards)
        function handler(handCards: any[]) {
            const statisRes = statisticsPoker(handCards)
            const filterRes = pickBy(statisRes, val => val === 4) // 过滤出炸弹
            const keys = Object.keys(filterRes)
            const targetKey = keys.find(k => k > min)
            if (targetKey) {  // 有打得过的 普通炸弹
                const idx = handCards.findIndex(card => card.value === targetKey)
                return handCards.splice(idx, 4)
            }
            if (handCards.filter(cards => ['joker', 'JOKER'].includes(cards.type)).length === 2) { // 有王炸
                return handCards.splice(handCards.length - 2, 2)
            }
            return []
        }
        return {
            result,
            type: result ? '炸弹' : null,
            min,
            max: min,
            handler
        }
    }
    smoothCheck(cards: any[]) { // 顺子检测
        if (cards.length < 4) {
            return {
                result: false,
                type: null
            }
        }
        // todo
        function handler(handCards: any[]) {
            const statisRes = statisticsPoker(handCards)
            const uniqueKeys = [...new Set(Object.keys(statisRes))].sort((a: any, b: any) => a - b)
            // uniqueKeys.find
            return []
        }
        const cardValues = cards.map(v => v.value).sort((a: any, b: any) => a - b)
        const len = cardValues.length
        const min = cardValues[0]
        const max = cardValues[len-1]
        const result = len > 4 && (max - min === len)
        return {
            result,
            type: result ? '顺子' : null,
            min,
            max,
            handler
        }
    }
    pairCheck(cards: any) { // 对子检测
        if (cards.length !== 2) {
            return {
                result: false,
                type: null
            }
        }
        const statisRes = statisticsPoker(cards)
        const keys = Object.keys(statisRes)
        const values = Object.values(statisRes);
        const min = keys[0]
        const result = (keys.length === 1) && values.includes(2)
        function handler(handCards: any[]) {
            const statisRes = statisticsPoker(handCards)
            const filterRes = pickBy(statisRes, val => val === 2)
            const filterKeys = Object.keys(filterRes).sort((a: any, b: any) => a - b)
            const targetKey = filterKeys.find(key => key > min)
            const idx = handCards.findIndex(cards => cards.value === targetKey)
            return handCards.splice(idx, 2)
        }
        return {
            result,
            type: result ? '对子' : null,
            min,
            max: min,
            handler
        }
    }
    smoothPairCheck(cards: any[]) { // 顺对检测
        if (cards.length % 2 !== 0) {
            return {
                result: false,
                type: null
            }
        }
        const statisRes = statisticsPoker(cards)
        const sortKeys: any = Object.keys(statisRes).sort((a: any, b: any) => a - b)
        const values = Object.values(statisRes);
        const len = sortKeys.length;
        const min = sortKeys[0]
        const max = sortKeys[len - 1]
        const result = (!values.some(v => v !== 2)) && (max - min === len)
        // todo
        function handler(handCards: any[]) {  
            return []
        }
        return {
            result,
            type: result ? '顺对' : null,
            min,
            max,
            handler
        }
    }
    planeCheck(cards: any) { // 三带一检测: (三带1，三不带，三带对儿)
        if (cards.length < 3 || cards.length > 5) {
            return {
                result: false,
                type: null
            }
        }
        const statisRes = statisticsPoker(cards)
        const keys = Object.keys(statisRes)
        const values = Object.values(statisRes);
        const min = Object.keys(pickBy(statisRes, val => val === 3))[0]
        const result = (keys.length <= 2) && values.includes(3) && cards.length < 6
        const type = result ? ['三不带', '三带一', '三带对'][cards.length - 3] : null
        // todo
        function handler(handCards: any[]) {  
            return []
        }
        return {
            result,
            type,
            min,
            max: min,
            handler
        }
    }
    smoothPlaneCheck(cards: any[]) { // 飞机检测
        if (cards.length < 6) {
            return {
                result: false,
                type: null
            }
        }
        const statisRes = statisticsPoker(cards)
        const values = Object.values(statisRes);
        const statisResMain = pickBy(statisRes, val => val === 3)
        const statisResMainKeys: any = Object.keys(statisResMain).sort((a: any, b: any) => a - b)
        const statisResMainLen = statisResMainKeys.length
        const restLen = cards.length - statisResMainLen * 3  // 剩余牌数
        const min = statisResMainKeys[0]
        const max = statisResMainKeys[statisResMainLen - 1]
        const result = statisResMainLen > 1  // 至少一个飞机
                && (max - min === statisResMainLen) // 飞机必须是连续的 [此处判断存在 bug, 例如: 666 777 888 999 jjj 4 就检测不通过 待优化]
                && ([0, statisResMainLen].includes(restLen) // 飞机不带翅膀 或者 飞机带单张
                    || ((restLen ===  statisResMainLen * 2) && !values.includes(1))    // 飞机都带对子
                )
        // todo
        function handler(handCards: any[]) {  
            return []
        }
        return {
            result,
            type: result ? '飞机': null,
            min,
            max,
            handler
        }
    }
    check(cards: any[]) { // 检查牌型
        const statisRes = statisticsPoker(cards)
        const keys = Object.keys(statisRes)
        const values = Object.values(statisRes);
        if (cards.length === 1) { // 单张牌
            return this.singleCheck(cards)
        }
        if (cards.length === 2) { // [对子, 王炸]
            if (values.some(val => val === 2)) {
                return this.pairCheck(cards) // 对子
            }
            return this.kingBomb(cards) // 王炸
        }
        if (!values.some(val => val !== 2) && cards.length > 3) { // 顺对儿
            return this.smoothPairCheck(cards)
        }
        if (!values.some(val => val !== 1) && cards.length > 4) { // 顺子
            return this.smoothCheck(cards)
        }
        if (values.some(val => val === 4) && cards.length === 4) {  // 普通炸弹
            return this.bombCheck(cards)
        }
        if (values.some(val => val === 3) && cards.length > 5) { // 飞机
            return this.smoothPlaneCheck(cards)
        }
        return this.planeCheck(cards)  // 三带n
    }
    AITips(currentCards: any[], handCards: any[]) { // 根据当前牌 和 手中牌 执行 推算 提示 
        if (!currentCards.length) {  // 
            return handCards.splice(0, 1)
        }
        const { result, type, min, max, handler } = this.check(currentCards)
        // console.log(type, result)
        return handler?.(handCards) || []
        // switch (type) {
        //     case '单张':
        //         handCards
        //         console.log('----单张====>', type)
        // }
    }
}

class Timer {
    // constructor(){}

}

// 斗地主 游戏

class ChinesePoker {
    poker: Poker
    players: any[]
    holeCards: any[]
    current: any
    currentOutCards: any[]
    allOutCards: any[]
    currentBig: any
    listeners: any[]
    isPause: boolean
    constructor() {
        this.isPause = false  // 暂停
        this.poker = new Poker()  
        this.players = new Array(playerNum)  // 玩家数组
        this.holeCards = []  // 底牌
        this.current = null  // 当前出牌者
        this.currentBig = null // 当前话语权
        this.currentOutCards = []   // 当前出的牌
        this.allOutCards = [] // 所有出的牌，便于记牌器统计分析
        this.listeners = [] // 订阅者
    }
    dealCards() { // 发牌
        this.poker.create()
        this.poker.wash()
        const { playerArr, holeCards } = dealPoker(this.poker.allCards, playerNum, 3)
        this.holeCards = holeCards
        playerArr.forEach((cards, i) => {
            this.players[i] = new Player({ cards, index: i, name: ['小曾', '小魏', '小张'][i] }, this)
        })
        // 构建玩家指针
        this.players.forEach(player => {
            player.next = this.players[(player.index+1) % playerNum]
            player.pre = this.players[(player.index-1 < 0 ? playerNum-1 : player.index-1) % playerNum]
        })
    }
    callMaster() { // 叫地主: 目的就是选出庄家，收底牌
        const who = Math.floor((Math.random() * 10) % playerNum)
        this.players[who].master = true // 默认 玩家1 为地主
        this.players[who].cards.push(...this.holeCards)
        this.players[who].sort()
        this.current = this.players[who]
        this.currentBig = this.current
    }
    endCheck() {  // 终止条件检测: 所有玩家手中只要有一个 玩家手中 没牌了就结束
        return this.players.some(player => player.cards?.length <= 0)
    }
    getWinner() { // 获取赢家
        return this.players.find(player => player.cards?.length <= 0)
    }
    resetReturnWho(){
        this.players.forEach(player => player.setReturnMe(false))
    }
    subscribe(listener?: any) {  // 添加订阅者
        this.listeners.push(listener)
        return () => {  // 取消订阅
            const idx = this.listeners.indexOf(listener)
            this.listeners.splice(idx, 1)
        }
    }
    pause(isPause?: boolean) {  // 是否暂停
        this.isPause = !!isPause
        if (!this.isPause) this.play()
    }
    start() { // 
        this.dealCards() // 洗牌
        this.callMaster() // 叫地主环节
        // 出牌环节
        this.play()
    }
    async play() { // 
        // 出牌环节
        while(!this.endCheck()) {
            // console.log('====endCheck===>', this.players)
            systomInfo(this.current)
            this.resetReturnWho()
            this.current.setReturnMe()
            const { outCards, next } = await this.current.out()
            if (outCards.length) {
                this.currentBig = this.current
            }
            systomInfo(this.current, outCards)
            this.current = next
            this.currentOutCards = outCards
            outCards.length && this.allOutCards.push(...outCards)
            if (this.currentBig === this.current) { // 没人要得起
                console.log(`===没人要得起, ${this.currentBig.name} 继续出牌 ===>`)
                // this.current = this.currentBig
            }
            this.listeners?.forEach(listener => listener?.(outCards))
            if (this.isPause) return
        }
        const winner = this.getWinner()
        console.log(`游戏结束 (${winner.master ? '地主' : '闲农'})   ${winner.name} 赢`)
        // console.log(this.players)
    }
}

export default ChinesePoker