import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Calendar, 
  Clock, 
  Mail, 
  Target, 
  Brain,
  ChevronDown,
  ChevronUp,
  Eye,
  Users
} from "lucide-react";

export default function AllResponses({ data }) {
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [showAll, setShowAll] = useState(false);

  const toggleCard = (id) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const toggleShowAll = () => {
    if (showAll) {
      setExpandedCards(new Set());
    } else {
      setExpandedCards(new Set(data.map(r => r.id)));
    }
    setShowAll(!showAll);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return 'לא ידוע';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')} דקות` : `${seconds} שניות`;
  };

  const parseJsonField = (field) => {
    if (!field) return [];
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [field];
    }
  };

  const getActivityLevel = (usage) => {
    if (usage?.includes('קבוע')) return { text: 'מתקדם', color: 'bg-green-100 text-green-800' };
    if (usage?.includes('ניסיתי')) return { text: 'מתחיל', color: 'bg-yellow-100 text-yellow-800' };
    if (usage?.includes('לא')) return { text: 'חדש', color: 'bg-gray-100 text-gray-800' };
    return { text: 'לא ידוע', color: 'bg-gray-100 text-gray-600' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">כל התגובות ({data.length})</h2>
        </div>
        <Button 
          onClick={toggleShowAll}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          {showAll ? 'סגור הכל' : 'הצג הכל'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((response) => {
          const isExpanded = expandedCards.has(response.id);
          const activityLevel = getActivityLevel(response.ai_usage_level);
          
          return (
            <Card key={response.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">
                      {response.first_name || `משיב #${response.id}`}
                    </CardTitle>
                  </div>
                  <Badge className={activityLevel.color}>
                    {activityLevel.text}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(response.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(response.completion_time)}</span>
                  </div>
                  
                  {response.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{response.email}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                {/* Basic Info - Always Visible */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">גיל:</span>
                    <span className="text-sm">{response.age_group || 'לא צוין'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">הגדרה עצמית:</span>
                    <span className="text-sm">{response.self_definition || 'לא צוין'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">עניין בקהילה:</span>
                    <span className="text-sm">{response.community_interest || 'לא צוין'}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    
                    {/* Current Activity */}
                    {response.current_activity && (
                      <div>
                        <span className="text-sm font-medium text-gray-700 block mb-1">פעילות נוכחית:</span>
                        <div className="flex flex-wrap gap-1">
                          {parseJsonField(response.current_activity).map((activity, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Known AI Tools */}
                    {response.known_ai_tools && (
                      <div>
                        <span className="text-sm font-medium text-gray-700 block mb-1">כלי AI מוכרים:</span>
                        <div className="flex flex-wrap gap-1">
                          {parseJsonField(response.known_ai_tools).map((tool, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Main Goal */}
                    {response.main_ai_goal && (
                      <div>
                        <span className="text-sm font-medium text-gray-700 block mb-1">מטרה עיקרית:</span>
                        <p className="text-sm bg-blue-50 p-2 rounded">{response.main_ai_goal}</p>
                      </div>
                    )}

                    {/* Biggest Challenge */}
                    {response.biggest_ai_challenge && (
                      <div>
                        <span className="text-sm font-medium text-gray-700 block mb-1">אתגר הגדול ביותר:</span>
                        <p className="text-sm bg-orange-50 p-2 rounded">{response.biggest_ai_challenge}</p>
                      </div>
                    )}

                    {/* AI Creation Dream */}
                    {response.ai_creation_dream && (
                      <div>
                        <span className="text-sm font-medium text-gray-700 block mb-1">חלום יצירה עם AI:</span>
                        <p className="text-sm bg-purple-50 p-2 rounded">{response.ai_creation_dream}</p>
                      </div>
                    )}

                    {/* Spending & Platform */}
                    <div className="grid grid-cols-2 gap-4">
                      {response.monthly_spending && (
                        <div>
                          <span className="text-sm font-medium text-gray-700 block">הוצאה חודשית:</span>
                          <span className="text-sm">{response.monthly_spending}</span>
                        </div>
                      )}
                      
                      {response.platform_access && (
                        <div>
                          <span className="text-sm font-medium text-gray-700 block">גישה לפלטפורמה:</span>
                          <span className="text-sm">{response.platform_access}</span>
                        </div>
                      )}
                    </div>

                    {/* AI Analysis */}
                    {response.ai_analysis && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-gray-700">ניתוח AI:</span>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg text-sm max-h-32 overflow-y-auto">
                          {response.ai_analysis}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Toggle Button */}
                <Button
                  onClick={() => toggleCard(response.id)}
                  variant="ghost"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2 mt-3"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      הצג פחות
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      הצג עוד
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 