from sqlalchemy import Column, Integer, ForeignKey, Table
from .database import Base

# Tabla intermedia para la relación muchos a muchos entre Profesor y Premio
profesor_premio = Table(
    'profesor_premio',
    Base.metadata,
    Column('profesor_id', Integer, ForeignKey('profesores.id')),
    Column('premio_id', Integer, ForeignKey('premios.id'))
) 