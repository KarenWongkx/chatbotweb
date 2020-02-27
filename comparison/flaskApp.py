from flask import Flask, request, jsonify
app = Flask(__name__)
from cosineSimilarity import *

Similarity = measure()

@app.route('/api/similarityCheck', methods=['GET','POST'])
def similarityCheck():
    content2 = request.json
    similarity_threshold = Similarity.measureSimilarity(content2['request'])

    return jsonify({"response":similarity_threshold})


if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)