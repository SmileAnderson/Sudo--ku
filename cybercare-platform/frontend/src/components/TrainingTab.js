// src/components/TrainingTab.js - Professional training component
import React, { useState } from 'react';
import { Trophy, Target, Award, CheckCircle, Play } from 'lucide-react';
import { styles } from '../styles/styles';
import { useTraining } from '../hooks/useData';
import { TRAINING_QUESTIONS } from '../data/constants';

const TrainingTab = () => {
  const { trainingData, modules, loading, completeModule, getQuestions } = useTraining();
  const [currentGame, setCurrentGame] = useState(null);

  const startTrainingModule = async (moduleId) => {
    try {
      const questions = await getQuestions(moduleId);
      setCurrentGame({
        moduleId,
        questions,
        currentQuestion: 0,
        score: 0,
        answers: []
      });
    } catch (error) {
      console.error('Failed to start training module:', error);
      // Fallback to local questions if API fails
      const localQuestions = TRAINING_QUESTIONS[moduleId] || [];
      if (localQuestions.length > 0) {
        setCurrentGame({
          moduleId,
          questions: localQuestions,
          currentQuestion: 0,
          score: 0,
          answers: []
        });
      }
    }
  };

  const answerQuestion = async (answerIndex) => {
    if (!currentGame) return;
    
    const question = currentGame.questions[currentGame.currentQuestion];
    const isCorrect = answerIndex === question.correct;
    
    const newAnswers = [...currentGame.answers, {
      questionIndex: currentGame.currentQuestion,
      answer: answerIndex,
      correct: isCorrect
    }];

    if (currentGame.currentQuestion + 1 >= currentGame.questions.length) {
      // Game finished
      const finalScore = newAnswers.filter(a => a.correct).length;
      
      try {
        await completeModule(currentGame.moduleId, finalScore, newAnswers);
      } catch (error) {
        console.error('Failed to complete module:', error);
      }
      
      setCurrentGame(null);
    } else {
      setCurrentGame(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        score: isCorrect ? prev.score + 1 : prev.score,
        answers: newAnswers
      }));
    }
  };

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px'}}>
          <div>Loading training data...</div>
        </div>
      </div>
    );
  }

  if (currentGame) {
    const question = currentGame.questions[currentGame.currentQuestion];
    const progress = ((currentGame.currentQuestion + 1) / currentGame.questions.length) * 100;
    
    return (
      <div style={styles.card}>
        <div style={{marginBottom: '24px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <h3 style={{fontSize: '20px', fontWeight: '600', color: '#0f172a', margin: 0}}>
              Training Module Assessment
            </h3>
            <span style={{fontSize: '14px', color: '#64748b'}}>
              Question {currentGame.currentQuestion + 1} of {currentGame.questions.length}
            </span>
          </div>
          
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${progress}%`}} />
          </div>
        </div>

        <div style={{marginBottom: '32px'}}>
          <h4 style={{fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#0f172a'}}>
            {question.question}
          </h4>
          
          <div style={{display: 'grid', gap: '12px'}}>
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => answerQuestion(index)}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.backgroundColor = '#f0f9ff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.backgroundColor = '#ffffff';
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Training Stats */}
      <div style={styles.grid3}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.metricLabel}>CEU Credits Earned</p>
              <p style={{...styles.metric, color: '#8b5cf6'}}>{(trainingData.currentScore / 100).toFixed(1)}</p>
              <span style={{...styles.badge, backgroundColor: '#f3e8ff', color: '#7c3aed'}}>
                Professional Development
              </span>
            </div>
            <Trophy color="#8b5cf6" size={28} />
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.metricLabel}>Training Streak</p>
              <p style={{...styles.metric, color: '#f59e0b'}}>{trainingData.streak}</p>
              <p style={{...styles.metricLabel, marginTop: '8px'}}>Consecutive weeks</p>
            </div>
            <Target color="#f59e0b" size={28} />
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.metricLabel}>Certifications</p>
              <div style={{display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap'}}>
                {trainingData.badges.length > 0 ? 
                  <span style={{fontSize: '14px', color: '#059669', fontWeight: '600'}}>
                    {trainingData.badges.length} Completed
                  </span> :
                  <span style={{fontSize: '14px', color: '#64748b'}}>0 Completed</span>
                }
              </div>
            </div>
            <Award color="#059669" size={28} />
          </div>
        </div>
      </div>

      {/* Training Modules */}
      <div style={styles.card}>
        <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#0f172a'}}>
          Professional Cybersecurity Training
        </h3>
        
        <div style={styles.grid2}>
          {modules.map(module => {
            const isCompleted = trainingData.completedModules.includes(module.id);
            const hasQuestions = TRAINING_QUESTIONS[module.id] || module.id === 'phishing' || module.id === 'passwords';
            
            return (
              <div
                key={module.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '24px',
                  backgroundColor: isCompleted ? '#f0fdf4' : '#ffffff',
                  borderColor: isCompleted ? '#bbf7d0' : '#e2e8f0',
                  cursor: hasQuestions && !isCompleted ? 'pointer' : 'default',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => hasQuestions && !isCompleted && startTrainingModule(module.id)}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                      <div style={{
                        width: '4px',
                        height: '40px',
                        backgroundColor: module.color || '#3b82f6',
                        borderRadius: '2px'
                      }} />
                      <div>
                        <h4 style={{fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0', color: '#0f172a'}}>
                          {module.title}
                        </h4>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#64748b',
                          backgroundColor: '#f1f5f9',
                          padding: '2px 8px',
                          borderRadius: '12px'
                        }}>
                          {module.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isCompleted && <CheckCircle color="#059669" size={24} />}
                </div>
                
                <p style={{fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5}}>
                  {module.description}
                </p>
                
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px'}}>
                  <div>
                    <p style={{fontSize: '12px', color: '#64748b', margin: '0 0 4px 0'}}>Level</p>
                    <p style={{fontSize: '14px', fontWeight: '600', margin: 0, color: '#0f172a'}}>{module.level}</p>
                  </div>
                  <div>
                    <p style={{fontSize: '12px', color: '#64748b', margin: '0 0 4px 0'}}>Duration</p>
                    <p style={{fontSize: '14px', fontWeight: '600', margin: 0, color: '#0f172a'}}>{module.duration}</p>
                  </div>
                  <div>
                    <p style={{fontSize: '12px', color: '#64748b', margin: '0 0 4px 0'}}>Credits</p>
                    <p style={{fontSize: '14px', fontWeight: '600', margin: 0, color: '#0f172a'}}>{module.credits}</p>
                  </div>
                </div>
                
                {!isCompleted && hasQuestions && (
                  <button style={{
                    ...styles.btn,
                    ...styles.btnPrimary,
                    width: '100%',
                    justifyContent: 'center'
                  }}>
                    <Play size={16} />
                    Begin Training Module
                  </button>
                )}
                
                {isCompleted && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#dcfce7',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CheckCircle size={16} color="#059669" />
                    <span style={{fontSize: '14px', fontWeight: '500', color: '#059669'}}>
                      Module Completed
                    </span>
                  </div>
                )}
                
                {!hasQuestions && !isCompleted && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <span style={{fontSize: '14px', color: '#64748b'}}>
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Company Performance */}
      <div style={styles.card}>
        <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#0f172a'}}>
          Department Training Performance
        </h3>
        
        <div style={{display: 'grid', gap: '12px'}}>
          {trainingData.leaderboard.map((dept, index) => {
            const isCurrentUser = dept.name === 'You';
            const userScore = isCurrentUser ? trainingData.currentScore : dept.points;
            
            return (
              <div key={dept.name} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: isCurrentUser ? '#f0f9ff' : '#f8fafc',
                border: isCurrentUser ? '2px solid #3b82f6' : '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: dept.position === 1 ? '#059669' : 
                                 dept.position === 2 ? '#3b82f6' : 
                                 dept.position === 3 ? '#f59e0b' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {dept.position}
                </div>
                <div style={{flex: 1}}>
                  <p style={{fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0', color: '#0f172a'}}>
                    {dept.name}
                  </p>
                  <p style={{fontSize: '14px', color: '#64748b', margin: 0}}>
                    {dept.department}
                  </p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p style={{fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0', color: '#0f172a'}}>
                    {userScore} pts
                  </p>
                  <p style={{fontSize: '12px', color: '#64748b', margin: 0}}>
                    Training Score
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrainingTab;