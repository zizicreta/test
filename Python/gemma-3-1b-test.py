

import sys
import torch
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

    print("\n=== 대화를 시작합니다. 종료하려면 Ctrl+C를 누르세요 ===")
    
    try:
        while True:
            # 사용자 입력 받기
            user_input = input("\n질문을 입력하세요: ")
            
            # 빈 입력 처리
            if not user_input.strip():
                continue
                
            print("\n답변 생성 중...")
            output = generator(
                user_input,
                max_length=1000,  # 더 긴 응답을 위해 길이 증가
                num_return_sequences=1,
                do_sample=True,
                temperature=0.7
            )

            # 결과 출력
            print("\n답변:")
            print(output[0]['generated_text'])

    except KeyboardInterrupt:
        print("\n\n프로그램을 종료합니다.")
        sys.exit(0)

if __name__ == "__main__":
    main()

