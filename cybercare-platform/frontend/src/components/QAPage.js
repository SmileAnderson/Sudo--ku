// src/components/QAPage.js - Q&A assessment page
import React, { useState } from 'react';
import { CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { styles } from '../styles/styles';
import { useCompliance } from '../hooks/useData';
import { QA_QUESTIONS } from '../data/constants'; 

const QAPage = ({ setActiveTab }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateComplianceCheck } = useCompliance();

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < QA_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      processResults();
    }
  };

  const processResults = async () => {
  setIsSubmitting(true);
  
  try {
    // Update compliance checks based on answers
    for (const question of QA_QUESTIONS) {
      const answer = answers[question.id];
      let shouldCheck = false;

      if (question.type === 'yes-no') {
        shouldCheck = answer === 'yes';
      } else if (question.type === 'multiple-choice') {
        const selectedOption = question.options.find(opt => opt.value === answer);
        shouldCheck = selectedOption?.points >= 0.8;
      }

      // Use the compliance mapping fields instead of the old category/item fields
      const category = question.complianceCategory || question.category;
      const itemId = question.complianceItemId || question.item;

      try {
        await updateComplianceCheck(category, itemId, shouldCheck);
      } catch (error) {
        console.error(`Failed to update compliance for ${category}-${itemId}:`, error);
      }
    }
  } catch (error) {
    console.error('Failed to process assessment results:', error);
  } finally {
    setIsComplete(true);
    setIsSubmitting(false);
  }
};
  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let maxPoints = 0;

    QA_QUESTIONS.forEach(question => {
      const answer = answers[question.id];
      
      if (question.type === 'yes-no') {
        maxPoints += 1;
        if (answer === 'yes') totalPoints += 1;
      } else if (question.type === 'multiple-choice') {
        maxPoints += 1;
        const selectedOption = question.options.find(opt => opt.value === answer);
        if (selectedOption) totalPoints += selectedOption.points;
      }
    });

    return Math.round((totalPoints / maxPoints) * 100);
  };

  if (isComplete) {
    const score = calculateScore();
    return (
      <div style={styles.card}>
        <div style={{textAlign: 'center', padding: '40px'}}>
          <CheckCircle color="#059669" size={64} style={{marginBottom: '20px'}} />
          <h2 style={{fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '16px'}}>
            Assessment Complete!
          </h2>
          <p style={{fontSize: '18px', color: '#64748b', marginBottom: '24px'}}>
            Your cybersecurity readiness score: <strong style={{color: '#059669'}}>{score}%</strong>
          </p>
          <p style={{fontSize: '14px', color: '#64748b', marginBottom: '32px', lineHeight: 1.6}}>
            Based on your answers, we've automatically updated your compliance checklist. 
            Review the compliance tab to see which areas need attention.
          </p>
          <div style={{display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap'}}>
            <button
              onClick={resetAssessment}
              style={{...styles.btn, ...styles.btnSecondary}}
            >
              <RefreshCw size={16} />
              Retake Assessment
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              style={{...styles.btn, ...styles.btnPrimary}}
            >
              View Updated Compliance
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = QA_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QA_QUESTIONS.length) * 100;

  return (
    <div>
      <div style={styles.card}>
        <div style={{marginBottom: '32px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <h2 style={{fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0}}>
              Quick Cybersecurity Assessment
            </h2>
            <span style={{fontSize: '14px', color: '#64748b'}}>
              Question {currentQuestion + 1} of {QA_QUESTIONS.length}
            </span>
          </div>
          
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${progress}%`}} />
          </div>
        </div>

        <div style={{marginBottom: '32px'}}>
          <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#0f172a'}}>
            {question.question}
          </h3>
          
          <p style={{fontSize: '14px', color: '#64748b', marginBottom: '24px', fontStyle: 'italic'}}>
            {question.helpText}
          </p>

          <div style={{display: 'grid', gap: '12px'}}>
            {question.type === 'yes-no' ? (
              <>
                <button
                  onClick={() => handleAnswer(question.id, 'yes')}
                  style={{
                    ...styles.btn,
                    ...(answers[question.id] === 'yes' ? styles.btnPrimary : styles.btnSecondary),
                    justifyContent: 'flex-start',
                    padding: '16px 20px',
                    fontSize: '16px'
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer(question.id, 'no')}
                  style={{
                    ...styles.btn,
                    ...(answers[question.id] === 'no' ? styles.btnPrimary : styles.btnSecondary),
                    justifyContent: 'flex-start',
                    padding: '16px 20px',
                    fontSize: '16px'
                  }}
                >
                  No
                </button>
              </>
            ) : (
              question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(question.id, option.value)}
                  style={{
                    ...styles.btn,
                    ...(answers[question.id] === option.value ? styles.btnPrimary : styles.btnSecondary),
                    justifyContent: 'flex-start',
                    padding: '16px 20px',
                    fontSize: '16px',
                    textAlign: 'left'
                  }}
                >
                  {option.text}
                </button>
              ))
            )}
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <button
            onClick={nextQuestion}
            disabled={!answers[question.id] || isSubmitting}
            style={{
              ...styles.btn,
              ...styles.btnPrimary,
              opacity: (!answers[question.id] || isSubmitting) ? 0.5 : 1,
              cursor: (!answers[question.id] || isSubmitting) ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Processing...' : (currentQuestion === QA_QUESTIONS.length - 1 ? 'Complete Assessment' : 'Next Question')}
            {!isSubmitting && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QAPage;