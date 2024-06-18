from datetime import datetime, timedelta

# Текущее время в UTC
current_time = datetime.utcnow()

# Вычитаем 8 часов
adjusted_time = current_time - timedelta(hours=1) - timedelta(minutes=34) - timedelta(seconds=34)
time_difference = current_time - adjusted_time

print(f"Current Time (UTC): {current_time}")
print(f"Adjusted Time (UTC - 8 hours): {adjusted_time}")

total_seconds = time_difference.total_seconds()
minutes = total_seconds // 60
