export interface SurveyTimeline {
    user_id: string;
    timeline: Array<SurveyObject> //list: Array<number> = [1, 2, 3]; I can also write Array<number> = [1, 2, 3]
}

export interface SurveyObject {
    dateOfCompletion : string;
    timestamp: number;
    readableTimestamp: string 
}