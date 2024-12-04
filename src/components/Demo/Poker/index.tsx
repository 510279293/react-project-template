import { useEffect, useState } from 'react';
import ChinesePoker, { CardProps } from './ChinesePoker'
// const poker = new Poker(2)
// poker.wash()
// console.log(poker)
const chinesePoker = new ChinesePoker()
chinesePoker.dealCards()

type PokerCardProps = {
    card?: CardProps;
    style?: any;
    selected?: boolean;
}
const PokerCard = ({card, selected, style, ...rest}: PokerCardProps) => {
    return (<div 
        style={{
            width: 46, 
            minWidth: 46, 
            height: 72, 
            padding: "2px 4px", 
            position: 'relative', 
            borderRadius: 4, 
            background: '#fff', 
            border: '1px solid #e5e5e5', 
            marginTop: selected ? -10 : 0,  // 选中的牌让它突出一些
            ...style
        }}
        {...rest}
        >
        <div style={{position: 'absolute', textAlign: 'center'}}>
            <div style={{fontSize: 14}}>{card?.value}</div>
            <div style={{fontSize: 8, marginTop: -5}}>{card?.type}</div>
        </div>
        <div style={{position: 'absolute', textAlign: 'center', transform: 'rotate(180deg)', right: 4, bottom: 2}}>
            <div style={{fontSize: 14}}>{card?.value}</div>
            <div style={{fontSize: 8, marginTop: -5}}>{card?.type}</div>
        </div>
    </div>)
}

const Player = ({player, style}: any) => {
    const { cards } = player
    const [selectedCards, setSelectedCards] = useState<any>([])
    const onSelect = (card?: any) => {
        const idx = selectedCards.indexOf(card)
        if (idx < 0) {  // 选中
            const newSelectedCards = [...selectedCards, card].sort((a: any, b: any) => a - b)
            setSelectedCards(newSelectedCards)
        } else { // 取消选中 
            selectedCards.splice(idx, 1)
            setSelectedCards([...selectedCards])
        }
    }
    const out = () => {  // 玩家出牌
        // player.out(() => selectedCards)
        player.ask = () => selectedCards
        setSelectedCards([])
    }
    return (<div style={{display: 'flex', position: 'absolute', ...style}}>
                <div style={{display: 'flex'}}>
                    {cards.map((card: CardProps, i: number) => <PokerCard card={card} selected={selectedCards?.includes(card)} onClick={() => onSelect(card)} style={{left: `${-24 * i}px`}} />)}
                </div>
                {
                    player.returnMe ? (<div style={{position: 'absolute', width: '100%', textAlign: 'center', bottom: -28}}>
                        <button onClick={out}>出牌</button>
                        <button>提示</button>
                    </div>) : null
                }
                
        </div>)
}

const Poker = () => {
    const { players } = chinesePoker
    const [outCards, setOutCards] = useState<any>([])
    const [isPause, setIsPause] = useState<boolean>(false)
    chinesePoker.subscribe(() => setOutCards([...chinesePoker?.allOutCards]))
    useEffect(() => {
        chinesePoker.start()
    }, [])
    
    return (<div style={{width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'green'}}>
        <div style={{width: 600, height: 600, position: 'relative',}}>
            {players.map((player: any, i: number) => {
                const { cards } = player
                const width = ((cards.length - 1) * 22 + 46)
                const calcStyle = () => {
                    switch(i){
                        case 0:
                            return {
                                bottom: 0,
                                left: `calc(50% - ${width/2}px)`
                            }
                        case 1:
                            return {
                                right: `-${width/2}px`,
                                top: `calc(50% - 36px)`,
                                transform: `rotate(${-90 * i}deg) translateY(-36px)`
                                // transformOrigin: 'right',
                            }
                        case 2: 
                            return {
                                left: `calc(50% - ${width/2}px)`,
                                transform: `rotate(${-0 * i}deg)`
                            }
                    }
                }
                return <Player player={player} key={player.name} style={{ width, transform: `rotate(${-90 * i}deg)`, ...calcStyle()}} />
            })}
        </div>
        <div>
            <button onClick={() => chinesePoker.pause(true)}>暂停</button>
            <button onClick={() => chinesePoker.pause(false)}>继续</button>
        </div>
    </div>)
}

export default Poker

// todo
// 发布订阅者模式