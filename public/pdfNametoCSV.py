import csv, os, re
import urllib.parse

### CONFIGURATION
cwd = os.getcwd()
directory = os.path.join(cwd, 'pub')

### END CONFIGURATION

# grabs data from text file
def namescraper(filename):
	filename = urllib.parse.quote(filename)
	return filename

# parses filename to find and store metadata like year, title, pg, etc.
def getmetadata(filename):
    ryear = re.search("\d{4}", filename)
    year = ryear.group(0)
    print(filename)
    rpub = re.search("\d{4} [^_]*", filename)
    pub = rpub.group(0)[5:]
    #print(pub), e.g. watchtower or awake!

    rmeta = re.search("[_][a-zA-z0-9 ,.&!]*(_|.)", filename)
    meta = rmeta.group(0).split('_')
    index = meta[1]
    title = meta[2]
	
    page = meta[3][2:len(meta[3]) - 4]
    return year, pub, index, title, page

# initializes csv file
fieldnames = ['bodypdf', 'cat2', 'cat1', 'cat4', 'cat3', 'pg']
writer = csv.DictWriter(open('foo.csv', 'w', encoding='UTF-8', newline=''), fieldnames=fieldnames)
writer.writeheader()

# iterates for every file in dir
for filename in os.listdir(directory):
	if filename.endswith(".pdf"): 
		
		# saves ALL text contents from file to variable textdata
		textdata = namescraper(filename)
		
		# gets metadata of textfile from its filename
		year, pub, index, title, page = getmetadata(filename)
		
		# writes metadata and data to dictionary. modify this line for adding HTML or pretty text to db
		writer.writerow({'bodypdf': textdata, 'cat2': year, 'cat1': pub, 'cat4': index, 'cat3': title, 'pg': page})

		continue
	else:
		continue


