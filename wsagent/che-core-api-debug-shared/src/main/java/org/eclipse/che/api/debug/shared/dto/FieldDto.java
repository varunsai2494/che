/*
 * Copyright (c) 2012-2017 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
package org.eclipse.che.api.debug.shared.dto;

import org.eclipse.che.api.debug.shared.model.Field;
import org.eclipse.che.dto.shared.DTO;

/** @author andrew00x */
@DTO
public interface FieldDto extends Field {
  @Override
  boolean isIsFinal();

  void setIsFinal(boolean value);

  FieldDto withIsFinal(boolean value);

  @Override
  boolean isIsStatic();

  void setIsStatic(boolean value);

  FieldDto withIsStatic(boolean value);

  @Override
  boolean isIsTransient();

  void setIsTransient(boolean value);

  FieldDto withIsTransient(boolean value);

  @Override
  boolean isIsVolatile();

  void setIsVolatile(boolean value);

  FieldDto withIsVolatile(boolean value);

  @Override
  String getName();

  void setName(String name);

  FieldDto withName(String name);

  @Override
  SimpleValueDto getValue();

  void setValue(SimpleValueDto value);

  FieldDto withValue(SimpleValueDto value);

  @Override
  String getType();

  void setType(String type);

  FieldDto withType(String type);

  @Override
  VariablePathDto getVariablePath();

  void setVariablePath(VariablePathDto variablePath);

  FieldDto withVariablePath(VariablePathDto variablePath);

  @Override
  boolean isPrimitive();

  void setPrimitive(boolean primitive);

  FieldDto withPrimitive(boolean primitive);
}
