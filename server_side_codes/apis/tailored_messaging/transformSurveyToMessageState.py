import json
import datetime
import re

from State import State
from MessageBucket import MessageBucket
import numpy as np
import random


def is_survey_day_weekend(ts):
    """
    Returns of "weekend" if today is weekend.
    Or "weekday" otherwise.
    Note there is a timezone effect. Server may not be in
    the same timezone as the participant. Better to
    determine form the survey field
    """

    digited_day_of_month = re.sub(
        "\d+(st|nd|rd|th)", lambda m: m.group()[:-2].zfill(2), ts
    )
    removed_colon = digited_day_of_month[:-3] + digited_day_of_month[-2:]
    datetime_obj = datetime.datetime.strptime(removed_colon, "%B %d %Y, %I:%M:%S %p %z")
    day_of_week_no = datetime_obj.weekday()

    if day_of_week_no < 5:
        return "Weekday"
    else:  # 5 Sat, 6 Sun
        return "Weekend"


def transform_survey_for_messaging(survey_data):
    message_tailor_object = {}

    message_tailor_object["day_of_survey"] = survey_data["ts"]

    # is weekend
    message_tailor_object["weekday_or_weekend"] = is_survey_day_weekend(
        survey_data["ts"]
    )
    #
    # Q1-location, Q2-who with, Q3 =??
    # Q4-Fatigue, Q5-Nausea,
    # Q6-postive mood, Q7-Neg mood, Q8=??
    # Q9-Adherence Motifivation, Q10-caregiver agreement
    # see "alex_survey_aya" for details
    question_key_for_tailoring = ["Q1", "Q2", "Q4", "Q5", "Q6", "Q7", "Q9", "Q10"]
    for question_key in question_key_for_tailoring:
        if question_key not in survey_data:
            continue

        if question_key == "Q1":
            message_tailor_object["location_Q1"] = survey_data["Q1"].strip()
        elif question_key == "Q2":
            message_tailor_object["social_company_Q2"] = survey_data["Q2"].strip()
        # Q3 messages pending
        elif question_key == "Q4":
            message_tailor_object["fatigue_Q4"] = int(survey_data["Q4"])
        elif question_key == "Q5":
            message_tailor_object["nausea_Q5"] = int(survey_data["Q5"])
        elif question_key == "Q6":
            message_tailor_object["pos_mood_Q6"] = int(survey_data["Q6"])
        elif question_key == "Q7":
            message_tailor_object["neg_mood_Q7"] = int(survey_data["Q7"])
        # Q8 messages pending
        elif question_key == "Q9":
            message_tailor_object["adherence_motivation_Q9"] = int(survey_data["Q9"])
        elif question_key == "Q10":
            message_tailor_object["cg_aya_agreement_Q10"] = survey_data["Q10"].strip()

    return message_tailor_object


def pick_a_message(state_list):
    # We currently have one bucket per state
    message_bucket_weight_list = [
        state.message_buckets[0]["prob_to_select"] for state in state_list
    ]
    message_bucket_prob_list = [
        weight / len(message_bucket_weight_list)
        for weight in message_bucket_weight_list
    ]
    #print(message_bucket_prob_list)

    n_samples = 1
    all_buckets = [state.message_buckets[0]["messages"] for state in state_list]
    #print(all_buckets)
    selected_bucket = np.random.choice(
        len(message_bucket_weight_list), n_samples, p=message_bucket_prob_list
    )
    #print(selected_bucket[0])

    sampled_message = random.sample(all_buckets[selected_bucket[0]], 1)[0]
    return (
        sampled_message,
        all_buckets[selected_bucket[0]],
        all_buckets,
        message_bucket_prob_list,
    )


if __name__ == "__main__":
    with open("./data/survey_1person.json") as f:
        survey_data = json.load(f)
        # print(survey_data)
        message_tailor_object = transform_survey_for_messaging(survey_data)
        # print(json.dumps(message_tailor_object, indent=4))

    # ==============================
    state_list = []

    # ============================== if weekend
    state = State()
    # Set survey results
    state.set_survey_results(message_tailor_object)

    # Determine state
    def is_weekend_true(message_tailor_object):
        return message_tailor_object["weekday_or_weekend"] == "Weekend"

    state.set_func_ptr_to_state(is_weekend_true)
    state_condition = state.determine_state_condition()
    # Add message buckets
    message_bucket = MessageBucket()
    message_bucket.add_csv_to_bucket("./data/buckets/1_bucket_weekend.csv")
    message_bucket.retrieve_messages_from_csv()
    state.add_message_bucket(message_bucket.return_all_messages(), 1, "weekend")
    if state_condition == True:
        state_list.append(state)

    # ============================== negative mood > 0
    state = State()
    # Set survey results
    state.set_survey_results(message_tailor_object)

    def is_neg_mood_gt_zero(message_tailor_object):
        return message_tailor_object["neg_mood_Q7"] > 0

    state.set_func_ptr_to_state(is_neg_mood_gt_zero)
    state_condition = state.determine_state_condition()
    # Add message buckets
    message_bucket = MessageBucket()
    message_bucket.add_csv_to_bucket("./data/buckets/2_bucket_neg_mood.csv")
    message_bucket.retrieve_messages_from_csv()
    state.add_message_bucket(message_bucket.return_all_messages(), 1, "neg_mood")
    if state_condition == True:
        state_list.append(state)

    # ============================== adherence_motivation_Q9 < 4
    state = State()
    # Set survey results
    state.set_survey_results(message_tailor_object)

    def is_adherence_motivation_lt_4(message_tailor_object):
        return message_tailor_object["adherence_motivation_Q9"] < 4

    state.set_func_ptr_to_state(is_adherence_motivation_lt_4)
    state_condition = state.determine_state_condition()
    # Add message buckets
    message_bucket = MessageBucket()
    message_bucket.add_csv_to_bucket("./data/buckets/3_bucket_adherence_motivation.csv")
    message_bucket.retrieve_messages_from_csv()
    state.add_message_bucket(
        message_bucket.return_all_messages(), 1, "adherence_motivation"
    )
    if state_condition == True:
        state_list.append(state)
    else:
        print("Adherence Motivation >= 4")

    # ============================== if location is not home
    state = State()
    # Set survey results
    state.set_survey_results(message_tailor_object)

    def is_location_not_home(message_tailor_object):
        return message_tailor_object["location_Q1"] != "Home (indoors)"

    state.set_func_ptr_to_state(is_location_not_home)
    state_condition = state.determine_state_condition()
    # Add message buckets
    message_bucket = MessageBucket()
    message_bucket.add_csv_to_bucket("./data/buckets/4_bucket_location.csv")
    message_bucket.retrieve_messages_from_csv()
    state.add_message_bucket(message_bucket.return_all_messages(), 1, "location")
    if state_condition == True:
        state_list.append(state)
    else:
        print("Location is home")

    # ============================== is social_company_Q2 alone
    state = State()
    # Set survey results
    state.set_survey_results(message_tailor_object)

    def is_social_company_is_alone(message_tailor_object):  # change
        return message_tailor_object["social_company_Q2"] == "Alone"  # change

    state.set_func_ptr_to_state(is_social_company_is_alone)  # change
    state_condition = state.determine_state_condition()
    # Add message buckets
    message_bucket = MessageBucket()
    message_bucket.add_csv_to_bucket(
        "./data/buckets/5_social_company_alone.csv"
    )  # change
    message_bucket.retrieve_messages_from_csv()
    state.add_message_bucket(
        message_bucket.return_all_messages(), 1, "social_company_alone"
    )  # change
    if state_condition == True:
        state_list.append(state)
    else:
        print("social company not alone")  # change

    # ============================== is social_company_Q2 friends
    state = State()
    # Set survey results
    state.set_survey_results(message_tailor_object)

    def is_social_company_is_friends(message_tailor_object):  # change
        return message_tailor_object["social_company_Q2"] == "Friend(s)"  # change

    state.set_func_ptr_to_state(is_social_company_is_friends)  # change
    state_condition = state.determine_state_condition()
    # Add message buckets
    message_bucket = MessageBucket()
    message_bucket.add_csv_to_bucket(
        "./data/buckets/6_social_company_friends.csv"
    )  # change
    message_bucket.retrieve_messages_from_csv()
    state.add_message_bucket(
        message_bucket.return_all_messages(), 1, "social_company_friends"
    )  # change
    if state_condition == True:
        state_list.append(state)
    else:
        print("social company not friends")  # change

    # ============================== is fatigue > 0
    state = State()
    # Set survey results
    state.set_survey_results(message_tailor_object)

    def is_fatigue_gt_0(message_tailor_object):  # change
        return message_tailor_object["fatigue_Q4"] > 0  # change

    state.set_func_ptr_to_state(is_fatigue_gt_0)  # change
    state_condition = state.determine_state_condition()
    # Add message buckets
    message_bucket = MessageBucket()
    message_bucket.add_csv_to_bucket("./data/buckets/7_fatigue.csv")  # change
    message_bucket.retrieve_messages_from_csv()
    state.add_message_bucket(
        message_bucket.return_all_messages(), 1, "fatigue"
    )  # change
    if state_condition == True:
        state_list.append(state)
    else:
        print("fatigue is zero")  # change

    # ============================== is nausea_Q5 > 0
    state = State()
    # Set survey results
    state.set_survey_results(message_tailor_object)

    def is_nausea_gt_0(message_tailor_object):  # change
        return message_tailor_object["nausea_Q5"] > 0  # change

    state.set_func_ptr_to_state(is_nausea_gt_0)  # change
    state_condition = state.determine_state_condition()
    # Add message buckets
    message_bucket = MessageBucket()
    message_bucket.add_csv_to_bucket("./data/buckets/8_nausea.csv")  # change
    message_bucket.retrieve_messages_from_csv()
    state.add_message_bucket(
        message_bucket.return_all_messages(), 1, "nausea"
    )  # change
    if state_condition == True:
        state_list.append(state)
    else:
        print("nausea is zero")  # change

    # ============================== is cg_aya_agreement_Q10 is Yes
    state = State()
    # Set survey results
    state.set_survey_results(message_tailor_object)

    def is_cg_aya_agreement_yes(message_tailor_object):  # change
        return message_tailor_object["cg_aya_agreement_Q10"] == "Yes"  # change

    state.set_func_ptr_to_state(is_cg_aya_agreement_yes)  # change
    state_condition = state.determine_state_condition()
    # Add message buckets
    message_bucket = MessageBucket()
    message_bucket.add_csv_to_bucket(
        "./data/buckets/9_parent_disagreement.csv"
    )  # change
    message_bucket.retrieve_messages_from_csv()
    state.add_message_bucket(
        message_bucket.return_all_messages(), 1, "cg_aya_agreement"
    )  # change
    if state_condition == True:
        state_list.append(state)
    else:
        print("cg_aya_agreement is no")  # change

    # ============================== is cg_aya_agreement_Q10 is Yes
    state = State()
    # Set survey results
    state.set_survey_results(message_tailor_object)

    def is_cg_aya_agreement_yes(message_tailor_object):  # change
        return message_tailor_object["cg_aya_agreement_Q10"] == "Yes"  # change

    state.set_func_ptr_to_state(is_cg_aya_agreement_yes)  # change
    state_condition = state.determine_state_condition()
    # Add message buckets
    message_bucket = MessageBucket()
    message_bucket.add_csv_to_bucket(
        "./data/buckets/9_parent_disagreement.csv"
    )  # change
    message_bucket.retrieve_messages_from_csv()
    state.add_message_bucket(
        message_bucket.return_all_messages(), 1, "cg_aya_agreement"
    )  # change
    if state_condition == True:
        state_list.append(state)
    else:
        print("cg_aya_agreement is no")  # change

    # ============================== positive mood > 2
    state = State()
    # Set survey results
    state.set_survey_results(message_tailor_object)

    def is_pos_mood_gt_2(message_tailor_object):
        return message_tailor_object["pos_mood_Q6"] > 2

    state.set_func_ptr_to_state(is_pos_mood_gt_2)
    state_condition = state.determine_state_condition()
    # Add message buckets
    message_bucket = MessageBucket()
    message_bucket.add_csv_to_bucket("./data/buckets/10_postive_mood.csv")
    message_bucket.retrieve_messages_from_csv()
    state.add_message_bucket(message_bucket.return_all_messages(), 1, "pos_mood")
    if state_condition == True:
        state_list.append(state)
    else:
        print("pos_mood <= 2")  # change

    #
    # for state in state_list:
    #    state.print_state()

    # select a message at random from the bucket
    (
        sampled_message,
        sampled_bucket,
        all_buckets,
        message_bucket_prob_list,
    ) = pick_a_message(state_list)

    print(f"sampled_message: {sampled_message}")
    print(f"sampled_bucket: {sampled_bucket}")
    print(f"sampled_bucket: {all_buckets}")
    print(f"message_bucket_prob_list: {message_bucket_prob_list}")
