import uuid
import random

def generar_sql(num_registros=100000, archivo_salida="insert_script.sql"):
    # Definir el nombre de la tabla y las columnas
    nombre_tabla = "receta"
    columnas = "(id, nombre, descripcion, foto, proceso, video)"
    
    # Lista de procesos para seleccionar aleatoriamente
    procesos = ["proceso_1", "proceso_2", "proceso_3", "proceso_4"]

    # Abrir el archivo donde se guardará el script SQL
    with open(archivo_salida, 'w') as f:
        # Escribir la cabecera del script
        f.write(f"BEGIN;\n\n")  # Iniciar una transacción

        # Generar los registros
        for i in range(1, num_registros + 1):
            # Generar valores para cada columna
            id_uuid = str(uuid.uuid4())
            nombre = f"Nombre_{i}"
            descripcion =  f"Descripcion de la receta con Nombre_{i}"
            foto = f"https://example.com/foto_{i}.jpg"
            proceso = random.choice(procesos)
            video = f"https://example.com/video_{i}.mp4"

            # Crear la sentencia INSERT sin comillas ni paréntesis innecesarios
            sql_insert = f"INSERT INTO {nombre_tabla} {columnas} VALUES ('{id_uuid}', '{nombre}', '{descripcion}','{foto}', '{proceso}', '{video}');\n"
            f.write(sql_insert)

            # Para evitar sobrecargar el archivo, puedes dividir en bloques grandes si es necesario
            if i % 10000 == 0:
                f.write("COMMIT;\nBEGIN;\n")  # Commit en intervalos grandes
        
        # Escribir el commit final
        f.write("COMMIT;\n")

    print(f"Script generado: {archivo_salida}")


if __name__ == "__main__":
    generar_sql()