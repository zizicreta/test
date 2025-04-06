import streamlit as st
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

@st.cache_resource
def load_model():
    model = AutoModelForCausalLM.from_pretrained("google/gemma-3-4b-it", device_map="auto", trust_remote_code=True)
    tokenizer = AutoTokenizer.from_pretrained("google/gemma-3-4b-it")
    return pipeline("text-generation", model=model, tokenizer=tokenizer)

st.title("📋 보험 QA 데모 (Gemma-4B + LoRA)")
st.write("보험 문서에 대한 질문을 입력하면, 자연어로 응답을 생성합니다.")

context = st.text_area("📄 문서 요약 or 내용", height=200, value="계약일 포함 90일이 지난 날의 다음 날부터 암 보장이 시작됩니다.")
question = st.text_input("❓ 질문", "2달 지나서 암 진단 받았는데 보험금 받을 수 있어?")

if st.button("질문에 답하기"):
    pipe = load_model()
    prompt = f"<|user|>\n{question}\n<context>\n{context}\n<|assistant|>\n"
    output = pipe(prompt, max_new_tokens=200)[0]["generated_text"]
    answer = output.split("<|assistant|>")[-1].strip()
    st.success(f"🤖 {answer}")
