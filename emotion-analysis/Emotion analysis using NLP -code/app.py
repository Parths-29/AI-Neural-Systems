from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
import numpy as np
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# --- 1. Load Artifacts ---
print("Loading model and tokenizer...")
model = load_model('emotion_model.h5')

with open('tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

# Download NLTK data (just in case)
nltk.download('stopwords')
ps = PorterStemmer()

# Mapping (Must match your training labels)
labels = {0: 'Anger', 1: 'Fear', 2: 'Joy', 3: 'Love', 4: 'Sadness', 5: 'Surprise'}

# --- 2. Helper Function: Preprocessing ---
# This must match the training logic EXACTLY
def clean_text(text):
    # Remove non-letters
    text = re.sub('[^a-zA-Z]', ' ', text)
    text = text.lower()
    text = text.split()
    # Stemming and Stopword removal
    text = [ps.stem(word) for word in text if not word in stopwords.words('english')]
    text = ' '.join(text)
    return text

# --- 3. The API Route ---
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the request
        data = request.json
        user_input = data.get('text', '')

        if not user_input:
            return jsonify({'error': 'No text provided'}), 400

        # Preprocess
        cleaned_text = clean_text(user_input)
        
        # Tokenize and Pad
        seq = tokenizer.texts_to_sequences([cleaned_text])
        padded = pad_sequences(seq, maxlen=20, padding='pre')

        # Predict
        prediction = model.predict(padded)
        label_index = np.argmax(prediction)
        confidence = float(np.max(prediction)) # Get confidence score
        
        result = labels[label_index]

        return jsonify({
            'emotion': result,
            'confidence': f"{confidence:.2f}",
            'original_text': user_input
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run on port 5000
    app.run(debug=True, port=5000)    