export interface UnlockedIncentives {
    user_id: string;
    last_date: string;
    timeline: Object //list: Array<number> = [1, 2, 3]; I can also write Array<number> = [1, 2, 3]
}


export interface UnlockedIncentive {
    unlocked_points: number;
    unlocked_money: number;
    current_point: number;
    date: string;
    isUnlockedViewShown: boolean;
    isBaselineSurvey: boolean; //note we will use this to distinguish, if we don't provide incentives for baseline survey.
}

