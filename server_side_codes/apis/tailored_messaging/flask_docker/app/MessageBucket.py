from abc import ABC, abstractmethod, abstractproperty

class MessageBucket:

    def __init__(self) -> None:
        self.messages = []
        self.csv_files = []

    def add_csv_to_bucket(self, csv_file_location):
        """
        add to the list csv files
        """
        self.csv_files.append(csv_file_location)
        pass

    def return_all_messages(self):
        """
        All the messages are returned as a list
        """
        return self.messages
 
    def retrieve_messages_from_csv(self):
        self.messages = []
        for csv_file in self.csv_files:
            with open(csv_file) as file:
                messages = [line.rstrip() for line in file]
            self.messages.extend(messages)
        pass
    
   
    def add_message(self, message):
        """
        Add a single message programmatically
        """
        self.messages.append(message)

    def print_messages(self):
        print(self.messages)


if __name__ == "__main__":
    message_bucket = MessageBucket()
    message_bucket.add_csv_to_bucket('./data/buckets/bucket_1.csv')
    message_bucket.retrieve_messages_from_csv()
    message_bucket.print_messages()


