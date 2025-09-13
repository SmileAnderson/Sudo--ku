// src/components/QAPage.js - Q&A assessment page
import React, { useState } from 'react';
import { CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { styles } from '../styles/styles';
import { useCompliance } from '../hooks/useData';

const QA_QUESTIONS = [
  {
    id: 1,
    question: "Does your company have an active firewall protecting your network?",
    category: 'network-security',
    item: 'firewall',
    type: 'yes-no',
    helpText: "A firewall is essential for blocking unauthorized network access."
  },
  {
    id: 2,
    question: "Do all employee accounts require multi-factor authentication (MFA)?",
    category: 'access-control',
    item: 'mfa',
    type: 'yes-no',
    helpText: "MFA adds an extra layer of security beyond just passwords."
  },
  {
    id: 3,
    question: "How many employees have access to sensitive company data?",
    category: 'access-control',
    item: 'privileged-access',
    type: 'multiple-choice',
    options: [
      { text: "Only specific authorized personnel", value: 'yes', points: 1 },
      { text: "Most employees have access", value: 'partial', points: 0.5 },
      { text: "Everyone can access everything", value: 'no', points: 0 }
    ],
    helpText: "Access should be limited based on job requirements (principle of least privilege)."
  },
  {
    id: 4,
    question: "Are your company's data backups encrypted?",
    category: 'data-protection',
    item: 'backup-encryption',
    type: 'yes-no',
    helpText: "Encrypted backups protect your data even if backup media is stolen."
  },
  {
    id: 5,
    question: "Do you have a documented incident response plan?",
    category: 'incident-response',
    item: 'incident-plan',
    type: 'yes-no',
    helpText: "A written plan helps your team respond quickly and effectively to security incidents."
  },
  {
    id: 6,
    question: "How often does your company conduct cybersecurity training?",
    category: 'compliance-governance',
    item: 'employee-training',
    type: 'multiple-choice',
    options: [
      { text: "Annually or more frequently", value: 'yes', points: 1 },
      { text: "Every few years", value: 'partial', points: 0.5 },
      { text: "Never or very rarely", value: 'no', points: 0 }
    ],
    helpText: "Regular training keeps employees aware of current threats and best practices."
  },
  {
    id: 7,
    question: "Does your company use antivirus software on all computers?",
    category: 'monitoring',
    item: 'threat-detection',
    type: 'yes-no',
    helpText: "Antivirus software helps detect and prevent malware infections."
  },
  {
    id: 8,
    question: "Are software updates applied regularly across your organization?",
    category: 'compliance-governance',
    item: 'change-management',
    type: 'multiple-choice',
    options: [
      { text: "Yes, automatically or within days", value: 'yes', points: 1 },
      { text: "Manually, within weeks", value: 'partial', points: 0.5 },
      { text: "Rarely or when we remember", value: 'no', points: 0 }
    ],
    helpText: "Regular updates patch security vulnerabilities and reduce attack risk."
  }
];

const QAPage = () => {
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

      try {
        await updateComplianceCheck(question.category, question.item, shouldCheck);
      } catch (error) {
        console.error('Failed to update compliance:', error);
      }
    }

    setIsComplete(true);
    setIsSubmitting(false);
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
              onClick={() => window.location.hash = '#compliance'}
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