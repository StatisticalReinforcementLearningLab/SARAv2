from MoodVisualization import MoodVisualization
from SleepVisualization import SleepVisualization

class VisualizationFactory:
    def __init__(self):
        self.list_of_visualizations = []
        self.list_of_visualizations.append("edu.harvard.srl.MoodVisualization")
        self.list_of_visualizations.append("edu.harvard.srl.SleepAppUsageVisualization")


    def generate_and_save_chart(self, chart_name):
        """
        generate and save charts
        """

        if chart_name == "edu.harvard.srl.MoodVisualization":
            return self.generate_mood_visualization()

        if chart_name == "edu.harvard.srl.SleepAppUsageVisualization":
            return self.generate_sleep_app_usage_visualization()


    def generate_and_save_all_charts(self):
        """
        generate and save all charts
        """
        pass


    def return_description_existing_charts(self):
        """
        return a list of all charts
        """
        pass


    #--------------------------------------------------
    #
    # Helper functions
    #
    #--------------------------------------------------
    def generate_mood_visualization(self):
        mood_visualization = MoodVisualization()
            
        mood_time_series_df = mood_visualization.generate_time_series_for_plot(
            { "config_file_name": "./config/mysql_config.json", 
                "database_name" : "HarvardDev",
                "userid" : "mash_aya" }
        )
        mood_chart = mood_visualization.store_visualization_to_s3(
            { "s3_config_file_name": "./config/aws_config.json", 
                "mood_time_series_df" : mood_time_series_df,
                "userid" : "mash_aya" }
        )

        return mood_chart

    def generate_sleep_app_usage_visualization(self):
        sleep_app_usage_visualization = SleepVisualization()

        sleep_app_usage_ts_df = sleep_app_usage_visualization.generate_time_series_for_plot("./config/saraSqlConfig.json", "88315702-a3e6-4296-8437-0a56b4c4f03b")
        
        if sleep_app_usage_ts_df is not None:
            sleep_app_usage_chart = sleep_app_usage_visualization.store_visualization_to_s3("./config/aws_config.json", sleep_app_usage_ts_df, "mash_aya")
            return sleep_app_usage_chart
        else:
            return None



