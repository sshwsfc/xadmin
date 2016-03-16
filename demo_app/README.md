#xadmin运行实例

##环境安装
```
pip install -r demo_requirements.txt
```

##初始化数据库
```
python manage.py syncdb
```

##导入初始化数据
```
python manage.py loaddata data.json
```

##运行实例
```
python manage.py runserver
```