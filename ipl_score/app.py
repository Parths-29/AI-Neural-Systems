import streamlit as st
import pandas as pd
import pickle
import os
import base64

# --- 1. CONFIG & IMAGE ENCODING ---
st.set_page_config(page_title="IPL Win Predictor", layout="centered")

def get_base64_of_bin_file(bin_file):
    with open(bin_file, 'rb') as f:
        data = f.read()
    return base64.b64encode(data).decode()

def set_bg(png_file):
    bin_str = get_base64_of_bin_file(png_file)
    page_bg_img = f'''
    <style>
    .stApp {{
        background-image: url("data:image/webp;base64,{bin_str}");
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }}
    
    /* Making the input containers readable with a glass effect */
    [data-testid="stVerticalBlock"] {{
        background-color: rgba(255, 255, 255, 0.7); 
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }}

    h1 {{
        color: #19398a; 
        text-align: center; 
        text-shadow: 2px 2px #ffffff; 
        font-family: 'Arial Black';
    }}

    div.stButton > button:first-child {{
        background-color: #ef252c; 
        color: white; 
        font-weight: bold; 
        width: 100%; 
        border-radius: 10px; 
        height: 3em;
        border: none;
    }}

    label {{
        color: #19398a !important; 
        font-weight: bold !important; 
    }}
    </style>
    '''
    st.markdown(page_bg_img, unsafe_allow_html=True)

# Apply background if image exists
if os.path.exists('img.webp'):
    set_bg('img.webp')
else:
    # Fallback to solid color if image is missing
    st.markdown("<style>.stApp { background-color: #00aee3; }</style>", unsafe_allow_html=True)

# --- 2. LOAD THE MODEL SAFELY ---
if os.path.exists('pipe.pkl'):
    with open('pipe.pkl', 'rb') as f:
        pipe = pickle.load(f)
else:
    st.error("Model file 'pipe.pkl' not found. Please run the Jupyter Notebook ('Run All') first!")
    st.stop()

st.title('IPL Win Probability Predictor')

# --- 3. DATA SETUP ---
teams = ['Sunrisers Hyderabad', 'Mumbai Indians', 'Royal Challengers Bangalore',
         'Kolkata Knight Riders', 'Kings XI Punjab', 'Chennai Super Kings',
         'Rajasthan Royals', 'Delhi Capitals']

cities = ['Hyderabad', 'Bangalore', 'Mumbai', 'Indore', 'Kolkata', 'Delhi',
          'Chandigarh', 'Jaipur', 'Chennai', 'Cape Town', 'Port Elizabeth',
          'Durban', 'Centurion', 'East London', 'Johannesburg', 'Kimberley',
          'Bloemfontein', 'Ahmedabad', 'Cuttack', 'Nagpur', 'Dharamsala',
          'Visakhapatnam', 'Pune', 'Raipur', 'Ranchi', 'Abu Dhabi',
          'Sharjah', 'Mohali', 'Bengaluru']

col1, col2 = st.columns(2)

with col1:
    batting_team = st.selectbox('Select the batting team', sorted(teams))
with col2:
    bowling_team = st.selectbox('Select the bowling team', sorted(teams))

selected_city = st.selectbox('Select match city', sorted(cities))
target = st.number_input('Target Score', min_value=0)

col3, col4, col5 = st.columns(3)

with col3:
    score = st.number_input('Current Score', min_value=0)
with col4:
    overs = st.number_input('Overs Completed', min_value=0.0, max_value=20.0, step=0.1)
with col5:
    wickets = st.number_input('Wickets Fallen', min_value=0, max_value=10)

# --- 4. PREDICTION LOGIC ---
if st.button('Predict Probability'):
    if overs > 0:
        # Calculate derived features
        runs_left = target - score
        balls_left = 120 - (overs * 6)
        wickets_remaining = 10 - wickets
        crr = score / overs
        rrr = (runs_left * 6) / balls_left

        # Create input DataFrame (column names must match training exactly)
        input_df = pd.DataFrame({
            'batting_team': [batting_team],
            'bowling_team': [bowling_team],
            'city': [selected_city],
            'runs_left': [runs_left],
            'balls_left': [balls_left],
            'wickets': [wickets_remaining],
            'total_runs_x': [target],
            'cur_run_rate': [crr],
            'req_run_rate': [rrr]
        })

        # Run Prediction
        result = pipe.predict_proba(input_df)
        
        st.header(f"{batting_team}: {round(result[0][1]*100)}%")
        st.header(f"{bowling_team}: {round(result[0][0]*100)}%")
    else:
        st.error("Overs must be greater than 0 to calculate probabilities.")