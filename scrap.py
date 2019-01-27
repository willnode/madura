from bs4 import BeautifulSoup
import urllib.request as request
import codecs
import time

abjad = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','r','s','t','u','v','w','y','z']

def fetch(index, abj):
	req = request.urlopen("http://kamus.madura.web.id/?page=%d&ask=%s" % (index, abj))
	try:
		return req.read().decode('utf-8')
	except:
		print("Error. Retrying...")
		time.sleep(1)
		return fetch(index, abj)


file = codecs.open("kata2.txt","w", "utf8")

i = 0
for abj in abjad:
	index = 1
	while True:
		tmp = fetch(index, abj)
		# print(tmp)
		soup = BeautifulSoup(tmp, features="html.parser")
		skipIt = True
		for link in soup.findAll("a", class_="result"):
			if not link.string:
				break
			file.write(link.get("tingkatan") + "," + link.get("arti") + "," + link.string + "\n")
			skipIt = False
			i += 1
			print("Got", i, ":", link.string)
		if skipIt:
			break
		index += 1

file.close()

