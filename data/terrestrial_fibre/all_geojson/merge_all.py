import os
import sys

#Read from textfile
list_of_files = []	
file = open('geojson_list.txt', 'r')
lines = file.readlines() #Read in all lines

for line in lines:
	list_of_files.append(line.rstrip())

file.close()

#Method to merge geojson files recursively
#Uses the merge-geojson.py forked script - https://gist.github.com/themiurgo/8687883
#Orginal script - https://gist.github.com/migurski/3759608
#Usage command: python %prog -p 2 input-1.json input-2.json output.json
def recurse_merge(prev_file, file_count):
	if (file_count == 29):
		os.system("python merge-geojsons.py " + str(file_count-1) + ".json"  + " " + list_of_files[29] + " | tee final.json")
		print("\nMerged all files.")
	else:
		os.system("python merge-geojsons.py " + prev_file + " " + list_of_files[file_count] + " | tee " + str(file_count) + ".json")
		prev_file = str(file_count) + ".json"
		recurse_merge(prev_file, file_count+1)

def make_clean(num_files):
	os.system("rm  {1.." + str(num_files-2) + "}.json")
	print("Removed extra json files.")

#Merge first geojson file
os.system("python merge-geojsons.py " + list_of_files[0]  + " " + list_of_files[1] + " | tee 1.json")
#Recursively merge the rest of the geojson files
recurse_merge("1.json", 2)
#Clean-up other json files
make_clean(len(list_of_files))

