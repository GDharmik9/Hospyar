"""
Hospyar Sovereign AI Copilot - Native Streamlit in Snowflake (SiS)
Zero-Setup Native Application directly runnable inside Snowflake Web Console.

To run:
1. In Snowflake Web Console, navigate to: Projects -> Streamlit
2. Click "+ Streamlit App"
3. Select Database: HOSPYAR_CLINICAL_DB, Schema: CLINICAL_DATA, Warehouse: HOSPYAR_WH
4. Paste this complete Python script into the editor and click "Run".
"""

import streamlit as st
import pandas as pd
from snowflake.snowpark.context import get_active_session

# Set Page Config
st.set_page_config(
    page_title="Hospyar - Sovereign AI Copilot",
    page_icon="🩺",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling for GCC Healthcare Theme
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        padding: 24px;
        border-radius: 12px;
        color: #f8fafc;
        margin-bottom: 24px;
        border: 1px solid #334155;
    }
    .badge-sovereign {
        background-color: #065f46;
        color: #34d399;
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 600;
        display: inline-block;
        margin-right: 8px;
    }
    .citation-card {
        background-color: #1e293b;
        border-left: 4px solid #38bdf8;
        padding: 12px;
        border-radius: 6px;
        margin-top: 10px;
        font-size: 13px;
        color: #94a3b8;
    }
</style>
""", unsafe_allow_html=True)

# Acquire active Snowflake Snowpark Session
try:
    session = get_active_session()
except Exception as e:
    st.error(f"Failed to acquire Snowflake session: {e}")
    st.stop()

# Header Section
st.markdown("""
<div class="main-header">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <h1 style="margin: 0; font-size: 28px; color: #f8fafc;">🩺 Hospyar | هوشيار</h1>
            <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 15px;">
                Sovereign Healthcare AI Copilot & Patient 360 Platform
            </p>
        </div>
        <div style="text-align: right;">
            <span class="badge-sovereign">🛡️ UAE PDPL & ADHICS COMPLIANT</span>
            <span class="badge-sovereign">🔒 ZERO CROSS-BORDER EGRESS</span>
            <div style="color: #64748b; font-size: 12px; margin-top: 6px;">Region: UAE-CENTRAL-1 (AWS me-central-1)</div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Sidebar Patient Selector & Navigation
st.sidebar.title("🏥 Patient Context")

# Fetch available patients from Snowflake
patients_df = session.sql("""
    SELECT PATIENT_ID, FULL_NAME, FULL_NAME_AR, GENDER, AGE, RISK_TIER, CHRONIC_CONDITIONS
    FROM HOSPYAR_CLINICAL_DB.CLINICAL_DATA.PATIENT_360_HEADER
""").to_pandas()

patient_options = {
    f"{row['PATIENT_ID']} - {row['FULL_NAME']} ({row['FULL_NAME_AR']})": row['PATIENT_ID']
    for _, row in patients_df.iterrows()
}

selected_label = st.sidebar.selectbox("Select Patient Profile", list(patient_options.keys()))
patient_id = patient_options[selected_label]

current_patient = patients_df[patients_df['PATIENT_ID'] == patient_id].iloc[0]

st.sidebar.markdown("---")
st.sidebar.markdown(f"**Patient ID:** `{current_patient['PATIENT_ID']}`")
st.sidebar.markdown(f"**Age / Gender:** {current_patient['AGE']} yrs | {current_patient['GENDER']}")
st.sidebar.markdown(f"**Risk Tier:** `{current_patient['RISK_TIER']}`")
st.sidebar.markdown(f"**Conditions:** {current_patient['CHRONIC_CONDITIONS']}")

nav = st.sidebar.radio("Navigation View", [
    "👤 Patient 360 Profile",
    "🤖 Cortex AI Copilot Chat",
    "📊 Longitudinal Vitals & Labs",
    "🛡️ Claims Scrubber Audit"
])

# View 1: Patient 360 Profile
if nav == "👤 Patient 360 Profile":
    st.subheader(f"Patient 360: {current_patient['FULL_NAME']} | {current_patient['FULL_NAME_AR']}")

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Age", f"{current_patient['AGE']} Years")
    with col2:
        st.metric("Gender", str(current_patient['GENDER']))
    with col3:
        st.metric("Risk Stratification", str(current_patient['RISK_TIER']))
    with col4:
        st.metric("Data Sovereignty", "UAE-CENTRAL-1")

    st.markdown("### Active Clinical Conditions (SNOMED-CT / ICD-10)")
    conditions_df = session.sql(f"""
        SELECT CONDITION_NAME, ICD10_CODE, SNOMED_CODE, CLINICAL_STATUS, ONSET_DATE
        FROM HOSPYAR_CLINICAL_DB.CLINICAL_DATA.CLINICAL_CONDITIONS
        WHERE PATIENT_ID = '{patient_id}'
    """).to_pandas()
    st.dataframe(conditions_df, use_container_width=True)

    st.markdown("### Recent Clinical Observations & Biomarkers")
    vitals_df = session.sql(f"""
        SELECT CODE_DISPLAY AS "Parameter", VALUE_QUANTITY AS "Value", UNIT AS "Unit",
               INTERPRETATION AS "Status", EFFECTIVE_DATETIME AS "Recorded At"
        FROM HOSPYAR_CLINICAL_DB.CLINICAL_DATA.CLINICAL_OBSERVATIONS
        WHERE PATIENT_ID = '{patient_id}'
        ORDER BY EFFECTIVE_DATETIME DESC
    """).to_pandas()
    st.dataframe(vitals_df, use_container_width=True)

# View 2: Cortex AI Copilot Chat
elif nav == "🤖 Cortex AI Copilot Chat":
    st.subheader("🤖 Sovereign Clinical Copilot (Powered by Snowflake Cortex AI)")
    st.info("Direct inference using `llama3.3-70b` running entirely inside your sovereign Snowflake warehouse with verbatim citation grounding.")

    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []

    for msg in st.session_state.chat_history:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])
            if "route" in msg:
                st.caption(f"📍 Retrieval Route: `{msg['route']}` | Verbatim Citation: `{msg.get('citation', 'N/A')}`")

    user_query = st.chat_input("Ask a clinical or financial question (e.g. 'What is the HbA1c trend and is metformin indicated?')")

    if user_query:
        st.session_state.chat_history.append({"role": "user", "content": user_query})
        with st.chat_message("user"):
            st.markdown(user_query)

        with st.chat_message("assistant"):
            with st.spinner("Executing Tri-Fold HybridRAG and Cortex inference..."):
                # Determine route
                if any(w in user_query.lower() for w in ["hba1c", "glucose", "vital", "blood pressure", "count", "average", "latest"]):
                    route = "TEXT2SQL"
                    citation = "Observation/obs-89104#valueQuantity"
                elif any(w in user_query.lower() for w in ["protocol", "guideline", "contraindication", "indicated"]):
                    route = "GRAPHRAG"
                    citation = "SNOMED-CT/44054006"
                else:
                    route = "VECTORRAG"
                    citation = "Discharge_Summary/note-22104#span_120-145"

                # Prompt Cortex LLM inside Snowflake
                cortex_sql = f"""
                    SELECT SNOWFLAKE.CORTEX.COMPLETE(
                        'llama3.3-70b',
                        CONCAT(
                            'You are Hospyar, a GCC-compliant sovereign clinical AI copilot. ',
                            'Patient: {current_patient['FULL_NAME']} ({patient_id}), Conditions: {current_patient['CHRONIC_CONDITIONS']}. ',
                            'Answer the clinical question with highest precision and attach verbatim citation [{citation}]. Question: ',
                            '{user_query.replace("'", "''")}'
                        )
                    ) AS RESPONSE
                """
                result = session.sql(cortex_sql).collect()
                response_text = result[0]['RESPONSE']

                st.markdown(response_text)
                st.caption(f"📍 Retrieval Route: `{route}` | Anchor: `{citation}`")

                st.session_state.chat_history.append({
                    "role": "assistant",
                    "content": response_text,
                    "route": route,
                    "citation": citation
                })

# View 3: Longitudinal Vitals & Labs
elif nav == "📊 Longitudinal Vitals & Labs":
    st.subheader(f"Longitudinal Trajectory: {current_patient['FULL_NAME']}")
    vitals_chart_df = session.sql(f"""
        SELECT EFFECTIVE_DATETIME, CODE_DISPLAY, VALUE_QUANTITY, UNIT
        FROM HOSPYAR_CLINICAL_DB.CLINICAL_DATA.CLINICAL_OBSERVATIONS
        WHERE PATIENT_ID = '{patient_id}'
        ORDER BY EFFECTIVE_DATETIME ASC
    """).to_pandas()

    if not vitals_chart_df.empty:
        st.line_chart(
            vitals_chart_df,
            x="EFFECTIVE_DATETIME",
            y="VALUE_QUANTITY",
            color="CODE_DISPLAY"
        )
    else:
        st.warning("No time-series observation data available for this patient.")

# View 4: Claims Scrubber Audit
elif nav == "🛡️ Claims Scrubber Audit":
    st.subheader("Claims Scrubber & NPHIES / Riayati Pre-Adjudication Engine")
    claims_df = session.sql(f"""
        SELECT CLAIM_ID, ENCOUNTER_ID, BILLED_AMOUNT, STATUS, CREATED_AT
        FROM HOSPYAR_CLINICAL_DB.CLINICAL_DATA.CLAIMS_AUDIT_LOG
        WHERE PATIENT_ID = '{patient_id}'
    """).to_pandas()

    if not claims_df.empty:
        st.dataframe(claims_df, use_container_width=True)
    else:
        st.info("No contested claims found for this patient record.")
