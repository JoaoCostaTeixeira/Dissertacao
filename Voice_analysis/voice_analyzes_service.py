
import threading, time
import io
import os
import sys
from kafka import KafkaAdminClient, KafkaConsumer, KafkaProducer
from kafka.admin import NewTopic
from SPARQLWrapper import SPARQLWrapper, JSON

class Consumer(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.stop_event = threading.Event()

    def stop(self):
        self.stop_event.set()

    def run(self):
        print("!!")
        consumer = KafkaConsumer(bootstrap_servers='localhost:9092',
                                 auto_offset_reset='earliest',
                                 consumer_timeout_ms=1000)
        consumer.subscribe(['AudioMyAnalyser2'])
        while not self.stop_event.is_set():
            for message in consumer:
              
                p2 = str(message.value).replace('b"', "").replace("'", "").replace('"', "").replace(' ', "")

                d = p2.split("__")
                mysp =__import__("my-voice-analysis")
                p = d[1].replace(".wav", "").replace("/" , "-")

                print(str(message.value))
                c=r"C:\Users\JoãoTeixeira\Desktop\dissertacao\Dissertacao\my-voice-analyzes"


                old_stdout = sys.stdout
                new_stdout = io.StringIO()
                sys.stdout = new_stdout

                mysp.myspgend(p,c)

                output = new_stdout.getvalue()
                sys.stdout = old_stdout
                if output.split(" ")[0] == "[]\na" :
                    print("asdasdasd")
                    genre = output.split(",")[0].replace('a ', '')
                    mood = ""
                    if len(output.split(","))<2 :
                        mood = "Showing no emotion"
                    else :
                        mood = output.split(",")[1].replace(' mood of speech: ', '')

                    old_stdout = sys.stdout
                    new_stdout = io.StringIO()
                    sys.stdout = new_stdout

                    mysp.mysptotal(p,c)

                    output = new_stdout.getvalue()
                    sys.stdout = old_stdout

                    numberofsyllables= output.splitlines()[2].split()[2]
                    numberofpauses= output.splitlines()[3].split()[1]
                    rateofspeech = output.splitlines()[4].split()[1]
                    articulationrate= output.splitlines()[5].split()[1]
                    speakingduration= output.splitlines()[6].split()[1]
                    originalduration = output.splitlines()[7].split()[1]
                    balance = output.splitlines()[8].split()[1]
                    f0mean = output.splitlines()[9].split()[1]
                    f0std = output.splitlines()[10].split()[1]
                    f0median = output.splitlines()[11].split()[1]
                    f0min = output.splitlines()[12].split()[1]
                    f0max = output.splitlines()[13].split()[1]
                    f0quantile25 = output.splitlines()[14].split()[1]
                    f0quan75 = output.splitlines()[15].split()[1]

                    sparql = SPARQLWrapper("http://localhost:8890/sparql")
        
                    sparql.setQuery("""
                    PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
                        prefix xsd: <http://www.w3.org/2001/XMLSchema#>
                            insert data { 
                            GRAPH <meet_analyser>{
                        <"""+ "stats_"+ d[1] + ">" + "  a meet:Statistics . " +
                        "<"+ "stats_" + d[1] + ">" +  ' meet:number_of_syllables '+ numberofsyllables +' .'+
                        "<"+ "stats_" + d[1] + ">" +  " meet:number_of_pauses "+ numberofpauses +" ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:rate_of_speech  "+ rateofspeech +" ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:articulation_rate  "+ articulationrate +" ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:speaking_duration  "+ speakingduration +" ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:original_duration  "+ originalduration +" ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:balance  "+ balance +" ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:f0_mean  "+ f0mean +" ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:f0_std  "+ f0std +" ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:f0_median  "+ f0median +" ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:f0_quantile25  "+ f0quantile25 +" ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:f0_quan75  "+ f0quan75 +" ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:genre  \""+ genre.splitlines()[1] +"\" ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:mood_of_speech  \""+ mood +"\" ."+
                        "<"+ d[1] + ">" +  " meet:hasStatistics  <"+ "stats_" + d[1] + ">" + " .} }")
                    
                    sparql.setReturnFormat(JSON)
                    result = sparql.query().convert()
                    try:
                        os.remove(p + ".wav") 
                        os.remove(p + ".TextGrid") 
                    except:
                        print("An exception occurred") 
                else:
                    sparql = SPARQLWrapper("http://localhost:8890/sparql")
        
                    sparql.setQuery("""
                    PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
                        prefix xsd: <http://www.w3.org/2001/XMLSchema#>
                            insert data { 
                            GRAPH <meet_analyser>{
                        <"""+ "stats_"+ d[1] + ">" + "  a meet:Statistics . " +
                        "<"+ "stats_" + d[1] + ">" +  ' meet:number_of_syllables 0 .'+
                        "<"+ "stats_" + d[1] + ">" +  " meet:number_of_pauses 0 ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:rate_of_speech  0 ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:articulation_rate  0 ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:speaking_duration  0 ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:original_duration  0 ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:balance 0 ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:f0_mean 0 ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:f0_std  0 ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:f0_median  0 ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:f0_quantile25  0 ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:f0_quan75 0 ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:genre  \"Not Detected\" ."+
                        "<"+ "stats_" + d[1] + ">" +  " meet:mood_of_speech  \"Not Detected\" ."+
                        "<"+ d[1] + ">" +  " meet:hasStatistics  <"+ "stats_" + d[1] + ">" + " .} }")
                    
                    sparql.setReturnFormat(JSON)
                    result = sparql.query().convert()
                    try:
                        os.remove(p + ".wav") 
                        os.remove(p + ".TextGrid") 
                    except:
                        print("An exception occurred") 
                    
        consumer.close()


def main():

    tasks = [
        Consumer()
    ]


    for t in tasks:
        t.start()

    time.sleep(10)

    # Stop threads
   # for task in tasks:
    #    task.stop()

    for task in tasks:
        task.join()


if __name__ == "__main__":
    main()

