#
# Created by Mash, Nov 16, 2020
#


class SingleVisualizationInterface:

    def __init__(self, name, description):
        self.name = name # give a name to this visualization
        self.description = description # give a description to this visualization
    
    def get_visualization_description(self):
        """
        return an object with a description of the visualization.
        """
        pass

    def generate_time_series_for_plot(self, arguments):
        """
        return an pandas time series data frame that will be used for plotting.
        """
        pass

    def store_visualization_to_s3(self, arguments):
        pass

    def store_time_series_to_s3(self, arguments):
        """
        return an pandas time series data frame that will be used for plotting.
        """
        pass

