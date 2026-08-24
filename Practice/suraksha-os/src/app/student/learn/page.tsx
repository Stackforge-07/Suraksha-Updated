'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { disasterModules } from '@/lib/data';
import { useAuthStore, useStudentProgressStore } from '@/lib/store';
import {
  Lock, CheckCircle2, ArrowRight, BookOpen, Award,
  Sparkles, Check, ChevronRight, Video, FileText, CheckSquare,
  HelpCircle, RotateCcw
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DisasterModule, ModuleSection, MistakeRecord, QuizAttemptRecord } from '@/lib/types';

function ModuleDetail({
  module,
  onBack,
  isAlreadyCompleted,
}: {
  module: DisasterModule;
  onBack: () => void;
  isAlreadyCompleted: boolean;
}) {
  const { user } = useAuthStore();
  const { completeModule } = useStudentProgressStore();

  const [activeTab, setActiveTab] = useState(module.sections[0]?.id || '');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [completedSuccess, setCompletedSuccess] = useState(false);

  const toggleSectionFinished = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections(prev => [...prev, sectionId]);
    }
  };

  const handleFinishModule = async () => {
    if (!user) return;
    const mistakes: MistakeRecord[] = [];
    let totalQuestions = 0;
    let correctCount = 0;

    module.sections.forEach(sec => {
      if (sec.type === 'quiz' && sec.content.questions) {
        sec.content.questions.forEach(q => {
          totalQuestions += 1;
          const selectedOptionId = quizAnswers[q.id];
          const selectedOption = q.options.find(o => o.id === selectedOptionId);
          if (selectedOption?.isCorrect) {
            correctCount += 1;
          } else if (selectedOption && !selectedOption.isCorrect) {
            mistakes.push({
              id: `quiz-mistake-${Date.now()}-${q.id}`,
              type: 'quiz',
              title: `${module.title} Quiz`,
              questionOrStep: q.question,
              mistakeText: selectedOption.text,
              explanation: q.explanation,
              hazardType: `${module.disasterType}_response`,
              timestamp: new Date().toISOString(),
            });
          }
        });
      }
    });

    const quizScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100;

    const quizAttempt: QuizAttemptRecord = {
      id: `quiz-${module.id}-${Date.now()}`,
      moduleId: module.id,
      moduleTitle: `${module.title} Knowledge Assessment`,
      disasterType: module.disasterType,
      userId: user.id,
      completedAt: new Date().toISOString(),
      score: quizScore,
      totalQuestions,
      correctCount,
      mistakesCount: mistakes.length,
      status: quizScore >= 70 ? 'passed' : 'completed',
    };

    await completeModule(user.id, module.id, quizAttempt, mistakes);
    setCompletedSuccess(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          ← Back to All Modules
        </button>

        {isAlreadyCompleted && (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs gap-1 font-semibold">
            <CheckCircle2 size={13} /> Completed &amp; Recorded in Teacher Roster
          </Badge>
        )}
      </div>

      {completedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1 animate-in zoom-in-95">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Sparkles size={18} className="text-emerald-600" />
            Module Successfully Completed!
          </div>
          <p className="text-xs text-emerald-700">
            Your progress and knowledge points have been updated and are now reflected live in your Class Teacher&apos;s dashboard.
          </p>
        </div>
      )}

      {/* Module Banner */}
      <Card className="border-slate-200/80 bg-white shadow-2xs rounded-2xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-emerald-50/70 via-slate-50 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-3xl shadow-2xs shrink-0">
              {module.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800">{module.title}</h1>
                <Badge variant="outline" className="text-[10px] capitalize bg-white text-slate-600">
                  {module.disasterType}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">{module.description}</p>
            </div>
          </div>

          <Button
            onClick={handleFinishModule}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs gap-1.5 shrink-0 cursor-pointer"
          >
            <CheckCircle2 size={15} /> Complete &amp; Save Progress
          </Button>
        </div>
      </Card>

      {/* Sections Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full bg-slate-100/80 p-1 rounded-xl" style={{ gridTemplateColumns: `repeat(${module.sections.length}, 1fr)` }}>
          {module.sections.map((section, idx) => (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className="text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs py-2"
            >
              {idx + 1}. {section.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {module.sections.map(section => (
          <TabsContent key={section.id} value={section.id} className="space-y-4">
            <Card className="border-slate-200/80 bg-white shadow-2xs rounded-2xl">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{section.title}</h3>
                    <p className="text-xs text-slate-500 capitalize">{section.type.replace('_', ' ')} Lecture &amp; Guidelines</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleSectionFinished(section.id)}
                    className={`text-xs h-7 gap-1 ${
                      completedSections.includes(section.id)
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
                        : 'text-slate-600'
                    }`}
                  >
                    {completedSections.includes(section.id) ? (
                      <>
                        <Check size={12} /> Section Read
                      </>
                    ) : (
                      'Mark as Read'
                    )}
                  </Button>
                </div>

                {section.type === 'overview' && (
                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {section.content.text}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {section.content.items?.map(item => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <span className="text-xl shrink-0">{item.icon}</span>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section.type === 'dos_donts' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2.5">
                      <h4 className="font-bold text-emerald-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                        <CheckCircle2 size={15} className="text-emerald-600" /> Recommended Do&apos;s
                      </h4>
                      <div className="space-y-2">
                        {section.content.items?.filter(i => i.type === 'do').map(item => (
                          <div key={item.id} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-white border border-emerald-100 text-slate-700">
                            <span>{item.icon}</span>
                            <span className="font-medium">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-2.5">
                      <h4 className="font-bold text-rose-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                        <CheckCircle2 size={15} className="text-rose-600" /> Prohibited Don&apos;ts
                      </h4>
                      <div className="space-y-2">
                        {section.content.items?.filter(i => i.type === 'dont').map(item => (
                          <div key={item.id} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-white border border-rose-100 text-slate-700">
                            <span>{item.icon}</span>
                            <span className="font-medium">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {section.type === 'steps' && (
                  <div className="space-y-2.5">
                    {section.content.items?.sort((a, b) => (a.order || 0) - (b.order || 0)).map((item, sIdx) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200/80 bg-slate-50/50"
                      >
                        <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {sIdx + 1}
                        </span>
                        <span className="text-lg shrink-0">{item.icon}</span>
                        <p className="text-xs text-slate-800 font-semibold leading-snug">{item.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section.type === 'checklist' && (
                  <div className="space-y-2">
                    {section.content.items?.map(item => (
                      <label
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={item.checked}
                          className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-xs font-medium text-slate-700">{item.text}</span>
                      </label>
                    ))}
                  </div>
                )}

                {section.type === 'quiz' && (
                  <div className="space-y-5">
                    {section.content.questions?.map((q, qi) => (
                      <div key={q.id} className="space-y-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                        <p className="font-bold text-xs text-slate-800">
                          Question #{qi + 1}: {q.question}
                        </p>
                        <div className="space-y-1.5">
                          {q.options.map(opt => {
                            const isSelected = quizAnswers[q.id] === opt.id;
                            const isCorrect = opt.isCorrect;

                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => !showResults && setQuizAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                                className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                                  showResults
                                    ? isCorrect
                                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                                      : isSelected
                                      ? 'border-rose-400 bg-rose-50 text-rose-950'
                                      : 'border-slate-200 bg-white opacity-70'
                                    : isSelected
                                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                              >
                                {opt.text}
                              </button>
                            );
                          })}
                        </div>
                        {showResults && (
                          <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                            💡 {q.explanation}
                          </p>
                        )}
                      </div>
                    ))}

                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        onClick={() => setShowResults(true)}
                        disabled={showResults || Object.keys(quizAnswers).length < (section.content.questions?.length || 0)}
                        className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold"
                      >
                        Check Quiz Answers
                      </Button>

                      {showResults && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowResults(false);
                            setQuizAnswers({});
                          }}
                          className="text-xs gap-1"
                        >
                          <RotateCcw size={12} /> Retry Quiz
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function LearnContent() {
  const { user } = useAuthStore();
  const { getStudentPrep, fetchStudentData } = useStudentProgressStore();

  React.useEffect(() => {
    if (user?.id) {
      fetchStudentData(user.id);
    }
  }, [user?.id, fetchStudentData]);

  const prep = user ? getStudentPrep(user.id) : undefined;
  const [selectedModule, setSelectedModule] = useState<DisasterModule | null>(null);

  if (selectedModule) {
    const isCompleted = prep?.completedModules.includes(selectedModule.id) || false;
    return (
      <ModuleDetail
        module={selectedModule}
        onBack={() => setSelectedModule(null)}
        isAlreadyCompleted={isCompleted}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Disaster Learning Modules</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Interactive curriculum, lectures, guidelines, and safety drills.
          </p>
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold px-3 py-1">
              🎓 Student: {user.name} • {prep?.completedModules.length || 0}/3 Modules Completed
            </Badge>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {disasterModules.map(module => {
          const isCompleted = prep?.completedModules.includes(module.id);

          return (
            <Card
              key={module.id}
              className={`border-slate-200/80 bg-white/90 shadow-2xs rounded-2xl flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all ${
                !module.isAvailable ? 'opacity-60' : ''
              }`}
            >
              <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl shrink-0">
                      {module.icon}
                    </div>
                    {isCompleted && (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-semibold">
                        <CheckCircle2 size={11} className="mr-1" /> Completed
                      </Badge>
                    )}
                    {!module.isAvailable && (
                      <Badge variant="outline" className="text-[10px] text-slate-400">
                        <Lock size={10} className="mr-1" /> Coming Soon
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-800 text-sm">{module.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{module.sections.length} Lessons &amp; Quizzes</span>
                    <span>~{module.estimatedMinutes} mins</span>
                  </div>

                  {module.isAvailable && (
                    <Button
                      size="sm"
                      variant={isCompleted ? 'outline' : 'default'}
                      className={`w-full text-xs font-semibold gap-1.5 cursor-pointer ${
                        isCompleted
                          ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                      onClick={() => setSelectedModule(module)}
                    >
                      {isCompleted ? 'Review Lectures' : 'Start Learning'} <ArrowRight size={13} />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <DashboardLayout requiredRole="student">
      <LearnContent />
    </DashboardLayout>
  );
}
