import altair as alt
from vega_datasets import data
cars = data.cars.url

chart = alt.Chart(cars).mark_bar().encode(
  x=alt.X('Miles_per_Gallon:Q', bin=True),
  y='count()',
)


from altair_saver import save
for fmt in ['json', 'vg.json', 'html', 'png', 'svg', 'pdf']:
  save(chart, f'chart.{fmt}')
