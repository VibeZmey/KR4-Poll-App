import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

const landmarks = [
    {
        id: 1,
        name: 'Красная площадь',
        city: 'Москва',
        image: '/kremlin.png',
        description: 'Главная площадь России и символ страны'
    },
    {
        id: 2,
        name: 'Петергоф',
        city: 'Санкт-Петербург',
        image: '/petergof.png',
        description: 'Дворцово-парковый ансамбль с фонтанами'
    },
    {
        id: 3,
        name: 'Озеро Байкал',
        city: 'Иркутская область',
        image: '/baikal.png',
        description: 'Самое глубокое озеро в мире'
    },
    {
        id: 4,
        name: 'Эрмитаж',
        city: 'Санкт-Петербург',
        image: '/hermitage.png',
        description: 'Один из крупнейших музеев мира'
    },
    {
        id: 5,
        name: 'Собор Василия Блаженного',
        city: 'Москва',
        image: '/basil.png',
        description: 'Уникальный архитектурный памятник XVI века'
    },
    {
        id: 6,
        name: 'Долина гейзеров',
        city: 'Камчатка',
        image: '/geysers.png',
        description: 'Единственное гейзерное поле в Евразии'
    }
]

const loadResults = () => {
    try {
        const saved = localStorage.getItem('votingResults')
        if (saved) {
            return JSON.parse(saved)
        }
    } catch (e) {
        console.error('Ошибка загрузки результатов:', e)
    }

    return landmarks.reduce((acc, landmark) => {
        acc[landmark.id] = 0
        return acc
    }, {})
}

const saveResults = (results) => {
    try {
        const jsonData = JSON.stringify(results, null, 2)
        localStorage.setItem('votingResults', jsonData)

        console.log('Сохранены результаты:', jsonData)
    } catch (e) {
        console.error('Ошибка сохранения результатов:', e)
    }
}

function App() {
    const [showResults, setShowResults] = useState(false)
    const [results, setResults] = useState(loadResults())
    const [selectedId, setSelectedId] = useState(null)

    const handleVote = (landmarkId) => {
        const newResults = { ...results, [landmarkId]: (results[landmarkId] || 0) + 1 }
        setResults(newResults)
        saveResults(newResults)

        setSelectedId(landmarkId)

        setTimeout(() => {
            setShowResults(true)
        }, 600)
    }

    const resetVoting = () => {
        setShowResults(false)
        setSelectedId(null)
    }

    const clearAllResults = () => {
        const emptyResults = landmarks.reduce((acc, landmark) => {
            acc[landmark.id] = 0
            return acc
        }, {})
        setResults(emptyResults)
        saveResults(emptyResults)
        setShowResults(false)
        setSelectedId(null)
    }

    const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0)

    const sortedLandmarks = [...landmarks].sort((a, b) =>
        (results[b.id] || 0) - (results[a.id] || 0)
    )

    return (
        <div className="app">
            <AnimatePresence mode="wait">
                {!showResults && (
                    <motion.div key="voting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="voting-container">
                        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="header">
                            <h1>🏛️ Какая достопримечательность России самая красивая?</h1>

                            <p className="subtitle">Выберите один вариант</p>

                            {totalVotes > 0 && (<p className="total-votes-info">Всего проголосовало: {totalVotes} человек</p>)}
                        </motion.div>

                        <div className="cards-grid">
                            {landmarks.map((landmark, index) => (
                                <motion.div key={landmark.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.5 }} className={`landmark-card ${selectedId === landmark.id ? 'selected' : ''}`}>
                                    <motion.div whileHover={{ y: -10, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => ! selectedId && handleVote(landmark.id)} className="card-inner">
                                        <div className="card-image">
                                            <img src={landmark.image} alt={landmark.name}
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www. w3.org/2000/svg" width="400" height="300"><rect fill="%23ddd" width="400" height="300"/><text x="50%" y="50%" text-anchor="middle" fill="%23999" font-size="18">Изображение</text></svg>'
                                                }}
                                            />
                                            {selectedId === landmark.id && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="selected-badge">✓</motion.div>)}
                                        </div>

                                        <div className="card-body">
                                            <h3>{landmark.name}</h3>
                                            <p className="city">📍 {landmark.city}</p>
                                            <p className="description">{landmark.description}</p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {showResults && (
                    <motion.div key="results" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }} className="results-container">
                        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                            <h1>🏆 Результаты голосования</h1>
                            <p className="total-votes">Всего голосов: {totalVotes}</p>
                        </motion.div>

                        <div className="results-list">
                            {sortedLandmarks.map((landmark, index) => {
                                const voteCount = results[landmark.id] || 0
                                const percentage = totalVotes > 0 ? (voteCount / totalVotes * 100).toFixed(1) : 0

                                return (
                                    <motion.div key={landmark.id} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 + 0.3 }} className={`result-item ${selectedId === landmark.id ? 'my-vote' : ''}`}>
                                        <div className="result-rank">
                                            {index === 0 && '🥇'}
                                            {index === 1 && '🥈'}
                                            {index === 2 && '🥉'}
                                            {index > 2 && `${index + 1}`}
                                        </div>

                                        <div className="result-image">
                                            <img src={landmark.image} alt={landmark.name}
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%23ddd" width="80" height="80"/></svg>'
                                                }}
                                            />
                                        </div>

                                        <div className="result-info">
                                            <h3>
                                                {landmark.name}
                                                {selectedId === landmark.id && (<span className="my-choice-badge">Ваш выбор</span>)}
                                            </h3>
                                            <p>{landmark.city}</p>
                                        </div>

                                        <div className="result-stats">
                                            <div className="vote-count">{voteCount}</div>
                                            <div className="percentage">{percentage}%</div>
                                        </div>

                                        <motion.div className="result-bar" initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ delay: index * 0.1 + 0.5, duration: 0.8, ease: "easeOut" }}/>
                                    </motion.div>
                                )
                            })}
                        </div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="button-group">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={resetVoting} className="btn btn-primary">Проголосовать еще раз</motion.button>

                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={clearAllResults} className="btn btn-secondary">Сбросить все результаты</motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default App