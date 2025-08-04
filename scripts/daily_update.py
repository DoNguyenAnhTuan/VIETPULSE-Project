from update_carbon import main
import asyncio
from datetime import datetime, timedelta

if __name__ == "__main__":
    # Cập nhật ngày hôm qua
    crawl_day = datetime.now() - timedelta(days=1)  # Hoặc -2 nếu muốn chắc chắn hôm qua có dữ liệu rồi

    date_str = crawl_day.strftime("%d-%m-%Y")

    print(f"[DAILY UPDATE] Updating data for {date_str}")
    asyncio.run(main(date_str, date_str))
    print("[DAILY UPDATE] Done.")
