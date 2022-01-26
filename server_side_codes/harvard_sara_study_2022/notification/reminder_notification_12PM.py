import pandas as pd
df = pd.read_excel('12pm_reminders.xlsx', dtype={'body': str, 'heading': str})
print(df)

# Reading an excel file using Python
import xlrd
import random
 
# Give the location of the file
loc = ("12pm_reminders.xlsx")

# To open Workbook
wb = xlrd.open_workbook(loc)
sheet = wb.sheet_by_index(0)

# print(sheet.nrows)
reminder_messages = []
for i in range(sheet.nrows):
    print(sheet.cell_value(i, 0))
    reminder_messages.append(sheet.cell_value(i, 0))

print(reminder_messages)
print(reminder_messages[random.randint(0,len(reminder_messages))])

# For row 0 and column 0
# print(sheet.cell_value(0, 0))