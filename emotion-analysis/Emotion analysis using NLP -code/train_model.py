import pandas as pd
import numpy as np
import re
import pickle
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Bidirectional
from tensorflow.keras.utils import to_categorical

# Download NLTK data (run once)
nltk.download('stopwords')

print("Loading datasets...")
# Load datasets (Assumes files are in a 'dataset' folder)
df_train = pd.read_csv('dataset/train.txt', header=None, sep=';', names=['Input', 'Sentiment'], encoding='utf-8')
df_test = pd.read_csv('dataset/test.txt', header=None, sep=';', names=['Input', 'Sentiment'], encoding='utf-8')
df_val = pd.read_csv('dataset/val.txt', header=None, sep=';', names=['Input', 'Sentiment'], encoding='utf-8')

# Combine train and val for better training
df = pd.concat([df_train, df_val], axis=0)

# --- 1. Label Encoding ---
# Map text labels (anger, joy, etc.) to numbers
label_map = {'anger': 0, 'fear': 1, 'joy': 2, 'love': 3, 'sadness': 4, 'surprise': 5}
df['Sentiment'] = df['Sentiment'].map(label_map)
y = to_categorical(df['Sentiment']) # Convert to one-hot encoding (e.g., [0,0,1,0,0,0])

# --- 2. Text Preprocessing ---
print("Preprocessing text...")
ps = PorterStemmer()
corpus = []

for i in range(len(df)):
    # Remove non-letters
    review = re.sub('[^a-zA-Z]', ' ', df['Input'].iloc[i])
    review = review.lower()
    review = review.split()
    # Stemming and Stopword removal
    review = [ps.stem(word) for word in review if not word in stopwords.words('english')]
    review = ' '.join(review)
    corpus.append(review)

# --- 3. Tokenization (Crucial for MERN integration) ---
# We use Tokenizer instead of simple one_hot so we can save the dictionary
voc_size = 5000
tokenizer = Tokenizer(num_words=voc_size, oov_token="<OOV>")
tokenizer.fit_on_texts(corpus)

# Convert text to sequences of numbers
sequences = tokenizer.texts_to_sequences(corpus)
max_length = 20
embedded_docs = pad_sequences(sequences, padding='pre', maxlen=max_length)

X_final = np.array(embedded_docs)
y_final = np.array(y)

# --- 4. Build Model ---
print("Building model...")
embedding_vector_features = 40
model = Sequential()
model.add(Embedding(voc_size, embedding_vector_features, input_length=max_length))
model.add(Bidirectional(LSTM(100)))
model.add(Dense(6, activation='softmax')) # 6 neurons for 6 emotions

model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

# --- 5. Train Model ---
print("Training model (this may take a few minutes)...")
model.fit(X_final, y_final, epochs=10, batch_size=64, validation_split=0.2)

# --- 6. Save Artifacts ---
print("Saving model and tokenizer...")

# Save the Keras model
model.save('emotion_model.h5')

# Save the tokenizer (needed to process new text in the app)
with open('tokenizer.pickle', 'wb') as handle:
    pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)

print("SUCCESS! Files 'emotion_model.h5' and 'tokenizer.pickle' created.")