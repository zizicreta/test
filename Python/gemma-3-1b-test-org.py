

import sys
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM

def main():
    # 로컬에 저장된 모델 디렉터리 경로 (필요에 따라 변경하세요)
    model_path = "c:/ai/models/gemma-3-1b-it"

    try:
        print("토크나이저 로드 중...")
        tokenizer = AutoTokenizer.from_pretrained(model_path)
        print("모델 로드 중...")
        model = AutoModelForCausalLM.from_pretrained(model_path)
    except Exception as e:
        print(f"모델을 로드하는 데 에러가 발생했습니다: {e}")
        sys.exit(1)

    # 텍스트 생성 파이프라인 설정
    print("텍스트 생성 파이프라인 설정 중...")
    generator = pipeline("text-generation", model=model, tokenizer=tokenizer)

    # 테스트할 입력 문장
    input_text = "Hello, this is a test input for my local model: "
    print("텍스트 생성 중...")
    output = generator(input_text, max_length=50, num_return_sequences=1)

    # 결과 출력
    print("생성된 텍스트:")
    print(output)

if __name__ == "__main__":
    main()

