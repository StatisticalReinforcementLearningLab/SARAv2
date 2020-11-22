from MoodVisualization import MoodVisualization

class VisualizationFactory:
    def __init__(self):
        self.list_of_visualizations = []
        self.list_of_visualizations.append("edu.harvard.srl.MoodVisualization")


    def generate_and_save_chart(self, chart_name):
        """
        generate and save charts
        """

        if chart_name == "edu.harvard.srl.MoodVisualization":
            return self.generate_mood_visualization()

        pass

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

