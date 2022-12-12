# Python tools for gened

## Fetch base data from reg chula for gened override (need to fill in section number)

```bash
python fetch_gened_courses_in_semester.py -sp {S,I} [{S,I} ...] -s {1,2,3} -y ACADEMIC_YEAR
```

Ex.

```bash
python3 fetch_gened_courses_in_semester.py -sp S I -s 2 -y 2565
```

## Upload gened override to cugetreg api

```bash
python3 upload_override_gened_sections.py -e {production,beta,dev} -f FILE -t TOKEN
```

Ex.

```bash
# can specify multiple environments
# assume working directory in this location
python3 upload_override_gened_sections.py -e dev beta production -f ./sections/gened_sections_2_65.csv -t YOUR_ADMIN_TOKEN_HERE
```
